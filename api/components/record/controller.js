const db = require("../../../store/models");
const Customer = db.customer;
const Record = db.record;
const RecordFile = db.recordFile;
const Beneficiary = db.beneficiary;
const error = require("../../../network/errors");

module.exports = function (injectedStore) {
  async function get(data) {
    return Record.findAll({
      include: [
        {
          model: Customer,
        },
        {
          model: Beneficiary,
          include: [RecordFile],
        },
      ],
    })
      .then((record) => {
        return record;
      })
      .catch((err) => {
        throw error(err);
      });
  }

  async function insert(data) {
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
