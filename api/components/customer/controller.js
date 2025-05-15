const db = require("../../../store/models");
const error = require("../../../utils/error");

//Sequelize Models
const Customer = db.customer;
const Record = db.record;
const RecordFile = db.recordFile;
const Beneficiary = db.beneficiary;
const Op = db.op;
const sequelize = db.sequelize;

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  async function list() {
    return await Customer.findAll({});
  }

  async function get(data) {
    try {
      return await Customer.findAll({
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
                    [Op.like]: "ENABLED",
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
            {
              [Op.and]: [
                {
                  identification_type: {
                    [Op.like]: `%${
                      data.identificationType?.toLowerCase() || ""
                    }%`,
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
          ],
        },
        include: [
          {
            model: Record,
          },
        ],
      });
    } catch (error) {
      console.log(error);
      throw error(error.message);
    }
  }

  async function insert(data) {
    return Customer.findOne({
      where: {
        identification_number: data.identificationNumber,
      },
    }).then((customer) => {
      if (customer) {
        throw error("customer already exists");
      }

      return Customer.create({
        customer_name: data.customerName,
        customer_type: data.customerType,
        identification_type: data.identificationType,
        identification_number: data.identificationNumber,
        phone_number: data.phoneNumber,
        nationality: data.nationality,
        birth_date: data.birthDate,
        email_address: data.emailAddress,
        country: data.country,
        state: data.state,
        city: data.city,
        sector: data.sector,
        street: data.street,
        residency_number: data.residencyNumber,
        income_source: data.incomeSource,
        commercial_registry: data.commercialRegistry,
        commercial_activity_type: data.commercialActivityType,
        commercial_activity_commentary: data.commercialActivityCommentary,
        employer_type: data.employerType,
        economic_sector: data.economicSector,
        company_type: data.companyType,
        company_funds_origin: data.companyFundsOrigin,
        company_private_pct: data.companyPrivatePct,
        company_public_pct: data.companyPublicPct,
        is_pep: data.isPep,
        is_politician: data.isPolitician,
        is_politician_relative: data.isPoliticianRelative,
        created_by: data.createdBy,
        last_modified_by: data.lastModifiedBy,
        risk_level: data.riskLevel,
        status_type: "ENABLED",
      }).then((createdCustomer) => {
        return createdCustomer.dataValues;
      });
    });
  }

  async function update(customerId, data) {
    Record.findOne({
      where: {
        customer_id: customerId,
        [Op.and]: {
          status_type: {
            [Op.notLike]: "DELETED",
          },
        },
      },
    }).then((record) => {
      Beneficiary.update(
        {
          is_pep: data.isPep,
          is_politician: data.isPolitician,
          is_politician_relative: data.isPoliticianRelative,
        },
        {
          where: {
            record_id: record.record_id,
          },
        }
      ).then((b) => {
        console.log(`Beneficiary updated! ${b}`);
      });
    });

    return Customer.update(
      {
        customer_name: data.customerName,
        customer_type: data.customerType,
        identification_type: data.identificationType,
        identification_number: data.identificationNumber,
        phone_number: data.phoneNumber,
        nationality: data.nationality,
        birth_date: data.birthDate,
        email_address: data.emailAddress,
        country: data.country,
        state: data.state,
        city: data.city,
        sector: data.sector,
        street: data.street,
        residency_number: data.residencyNumber,
        income_source: data.incomeSource,
        commercial_registry: data.commercialRegistry,
        commercial_activity_type: data.commercialActivityType,
        commercial_activity_commentary: data.commercialActivityCommentary,
        employer_type: data.employerType,
        economic_sector: data.economicSector,
        company_type: data.companyType,
        company_funds_origin: data.companyFundsOrigin,
        company_private_pct: data.companyPrivatePct,
        company_public_pct: data.companyPublicPct,
        is_pep: data.isPep,
        risk_level: data.riskLevel,
        is_politician: data.isPolitician,
        is_politician_relative: data.isPoliticianRelative,
        created_by: data.createdBy,
        last_modified_by: data.lastModifiedBy,
      },
      {
        where: {
          customer_id: customerId,
        },
      }
    ).then((customer) => {
      return customer;
    });
  }

  async function remove(customerId) {
    return Customer.update(
      {
        status_type: "DELETED",
      },
      {
        returning: true,
        where: {
          customer_id: customerId,
        },
      }
    )
      .then((customer) => {
        Record.update(
          {
            status_type: "DELETED",
          },
          {
            returning: true,
            where: {
              customer_id: customerId,
            },
          }
        )
          .then((record) => {
            if (record[0] != 0) {
              Beneficiary.update(
                {
                  status_type: "DELETED",
                },
                {
                  returning: true,
                  where: {
                    record_id: record[1][0].record_id,
                  },
                }
              )
                .then((beneficiary) => {
                  if (beneficiary[0] != 0) {
                    RecordFile.update(
                      {
                        status_type: "DELETED",
                      },
                      {
                        where: {
                          beneficiary_id: [
                            ...beneficiary[1].map((b) => b.beneficiary_id),
                          ],
                        },
                      }
                    )
                      .then((recordFile) => {
                        return customer;
                      })
                      .catch((err) => {
                        console.log(err);
                        throw error(err);
                      });
                  } else {
                    return customer;
                  }
                })
                .catch((err) => {
                  console.log(err);
                  throw error(err);
                });
            } else {
              return customer;
            }
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
  //   //Validate if the customer is not being used by any other entity
  //   const customer = await store.get(
  //     TABLE,
  //     customerModel({ customerId: id, status: "CREATED" }, "find")
  //   );

  //   if (customer.length > 0) {
  //     return store.update(TABLE, id, customerModel(data, "update"));
  //   } else {
  //     throw new Error("customer not found!");
  //   }
  // }

  //async function

  return {
    list,
    get,
    insert,
    update,
    remove,
  };
};
