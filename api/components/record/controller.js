const db = require("../../../store/models");
const Customer = db.customer;
const Record = db.record;
const RecordFile = db.recordFile;
const Beneficiary = db.beneficiary;
const BeneficiaryFileType = db.beneficiaryFileType;
const FileType = db.fileType;
const Op = db.op;
const sequelize = db.sequelize;
const error = require("../../../network/errors");

module.exports = function (injectedStore) {
  async function get(data) {
    let [...beneficiaryFileType] = await BeneficiaryFileType.findAll({
      where: {
        status_type: {
          [Op.notLike]: "DELETED",
        },
      },
      include: [
        {
          model: FileType,
          where: {
            status_type: {
              [Op.notLike]: "DELETED",
            },
          },
        },
      ],
    });
    beneficiaryFileType = beneficiaryFileType.map((item) => item.dataValues);

    console.log(data);

    const getFileAmount = (
      beneficiaryType,
      { isPep, isPolitician, isPoliticianRelative } = {},
      recordFiles
    ) => {
      let result = beneficiaryFileType.filter((item) => {
        if (
          item.beneficiary_type == beneficiaryType ||
          (isPep == true &&
            item.beneficiary_type == `${beneficiaryType}_PEP`) ||
          (isPolitician == true &&
            item.beneficiary_type == `${beneficiaryType}_POLITICIAN`) ||
          (isPoliticianRelative == true &&
            item.beneficiary_type == `${beneficiaryType}_POLITICIAN_RELATIVE`)
        ) {
          return true;
        }
      });

      // let fileteredResults = [];

      // result.forEach((item) => {
      //   let isAlreadyUploaded =
      //     recordFiles.filter(
      //       (rf) => rf.dataValues.file_type_id == item.file_type_id
      //     ).length > 0;

      //   if (!isAlreadyUploaded) {
      //     fileteredResults.push(item);
      //   }
      // });

      // console.log("RESULTADOS", fileteredResults[0].file_type);

      return result;
    };

    const getMissingFiles = (
      beneficiaryType,
      { isPep, isPolitician, isPoliticianRelative } = {},
      recordFiles
    ) => {
      let result = beneficiaryFileType.filter((item) => {
        if (
          item.beneficiary_type == beneficiaryType ||
          (isPep == true &&
            item.beneficiary_type == `${beneficiaryType}_PEP`) ||
          (isPolitician == true &&
            item.beneficiary_type == `${beneficiaryType}_POLITICIAN`) ||
          (isPoliticianRelative == true &&
            item.beneficiary_type == `${beneficiaryType}_POLITICIAN_RELATIVE`)
        ) {
          return true;
        }
      });

      let fileteredResults = [];

      result.forEach((item) => {
        let isAlreadyUploaded =
          recordFiles.filter(
            (rf) => rf.dataValues.file_type_id == item.file_type_id
          ).length > 0;

        if (!isAlreadyUploaded) {
          fileteredResults.push(item);
        }
      });

      return fileteredResults;
    };

    return Record.findAll({
      where: {
        record_id: {
          [Op.like]: `%${data.recordId || ""}%`,
        },
      },
      include: [
        {
          model: Customer,
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("lower", sequelize.col("customer_name")),
                {
                  [Op.like]: `%${data.customerName?.toLowerCase() || ""}%`,
                }
              ),
              {
                [Op.and]: [
                  {
                    status_type: {
                      [Op.notLike]: `DELETED`,
                    },
                  },
                ],
              },
              {
                [Op.and]: [
                  {
                    identification_number: {
                      [Op.like]: `%${data.identificationNumber || ""}%`,
                    },
                  },
                ],
              },
              {
                [Op.and]: [
                  {
                    identification_number: {
                      [Op.like]: `%${
                        data.identificationNumber?.toLowerCase() || ""
                      }%`,
                    },
                  },
                ],
              },
              {
                [Op.and]: [
                  {
                    phone_number: {
                      [Op.like]: `%${data.phoneNumber?.toLowerCase() || ""}%`,
                    },
                  },
                ],
              },
              {
                [Op.and]: [
                  {
                    customer_type: {
                      [Op.like]: `%${data.customerType || ""}%`,
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          model: Beneficiary,
          include: [
            {
              model: RecordFile,
              required: false,
              where: {
                status_type: {
                  [Op.not]: "DELETED",
                },
              },

              include: [FileType],
            },
          ],
        },
      ],
      order: [[Beneficiary, RecordFile, "created_at", "DESC"]],
    })
      .then((record) => {
        let response = [];
        for (let i = 0; i < record.length; i++) {
          // console.log(record[i].dataValues);
          for (let j = 0; j < record[i].dataValues.beneficiaries.length; j++) {
            record[i].beneficiaries[j].dataValues.required_files =
              getFileAmount(
                record[i].beneficiaries[j].dataValues.beneficiary_type,
                {
                  isPep: record[i].beneficiaries[j].dataValues.is_pep,
                  isPolitician:
                    record[i].beneficiaries[j].dataValues.is_politician,
                  isPoliticianRelative:
                    record[i].beneficiaries[j].dataValues
                      .is_politician_relative,
                },
                record[i].beneficiaries[j].dataValues.record_files
              );

            record[i].beneficiaries[j].dataValues.missing_files =
              getMissingFiles(
                record[i].beneficiaries[j].dataValues.beneficiary_type,
                {
                  isPep: record[i].beneficiaries[j].dataValues.is_pep,
                  isPolitician:
                    record[i].beneficiaries[j].dataValues.is_politician,
                  isPoliticianRelative:
                    record[i].beneficiaries[j].dataValues
                      .is_politician_relative,
                },
                record[i].beneficiaries[j].dataValues.record_files
              );
          }
        }

        // let response = record.map((item) => {
        //     return {
        //       ...item,
        //       file_amount: getFileAmount(item.beneficiary_type)
        //     }
        // })
        return record;
      })
      .catch((err) => {
        throw error(err);
      });
  }

  async function insert(data) {
    let [customer] = await sequelize.query(`
    select customer_name, customer_type, identification_type, identification_number, nationality 
    from customer
    where customer_id = '${data.customerId}'
    `);

    Record.create({
      record_code: data.recordCode,
      customer_id: data.customerId,
      number_of_beneficiaries: data.numberOfBeneficiaries,
      status_type: "CREATED",
      created_by: data.createdBy,
      last_modified_by: data.lastModifiedBy,
    })
      .then((record) => {
        console.log(record);
        let beneficiaries = data.beneficiaries.map((b) => ({
          record_id: record.dataValues.record_id,
          order: b.order,
          beneficiary_type: b.beneficiaryType,
          name: b.name,
          identification_type: b.identificationType,
          identification_number: b.identificationNumber,
          nationality: b.nationality,
          stocks_percentage: b.stocksPercentage,
          is_pep: b.isPep,
          is_politician: b.isPolitician,
          is_politician_relative: b.isPoliticianRelative,
        }));

        if (customer[0].customer_type == "LEGAL_PERSON") {
          Beneficiary.create({
            record_id: record.dataValues.record_id,
            order: data.beneficiaries.length,
            beneficiary_type: "LEGAL_PERSON",
            name: customer[0].customer_name,
            identification_type: customer[0].identification_type,
            identification_number: customer[0].identification_number,
            nationality: customer[0].nationality,
            stocks_percentage: 0,
            is_pep: null,
            is_politician: null,
            is_politician_relative: null,
          })
            .then(() => {
              console.log("BUSINESS RECORD CREATED");
            })
            .catch((err) => {
              console.log(err);
            });
        }

        Beneficiary.bulkCreate(beneficiaries)
          .then((res) => {
            Record.find;

            return { ...record, ...res };
          })
          .catch((err) => {
            console.log(err);
            throw error(err);
          });
      })
      .catch((err) => {
        console.log(err);
        throw error(err);
      });
  }

  // async function update(id, data) {
  //   //Validate if the record is not being used by any other entity
  //   const record = await store.get(
  //     TABLE,
  //     recordModel({ recordId: id, status: "CREATED" }, "find")
  //   );

  //   if (record.length > 0) {
  //     return store.update(TABLE, id, recordModel(data, "update"));
  //   } else {
  //     throw new Error("record not found!");
  //   }
  // }

  //async function

  return {
    get,
    insert,
    // update,
  };
};
