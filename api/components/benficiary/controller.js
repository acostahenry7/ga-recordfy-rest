const db = require("../../../store/models");

//Sequelize Models
const Beneficiary = db.beneficiary;
const Op = db.op;
const sequelize = db.sequelize;

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  async function list() {
    return await Beneficiary.findAll({});
  }

  async function get(data) {
    console.log(data);
    try {
      return await Beneficiary.findAll({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn("lower", sequelize.col("beneficiary_name")),
              {
                [Op.like]: `%${data.beneficiaryName?.toLowerCase() || ""}%`,
              }
            ),
            {
              [Op.and]: [
                {
                  beneficiary_type: {
                    [Op.like]: `%${data.beneficiaryType || ""}%`,
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
      });
    } catch (error) {
      console.log(error);
      throw error(error.message);
    }
  }

  //   async function insert(data) {
  //     console.log(data);
  //     return Beneficiary.findOne({
  //       where: {
  //         identification_number: data.identificationNumber,
  //       },
  //     }).then((beneficiary) => {
  //       if (beneficiary) {
  //         throw error("beneficiary already exists");
  //       }

  //       return Beneficiary.create({
  //         beneficiary_name: data.beneficiaryName,
  //         beneficiary_type: data.beneficiaryType,
  //         identification_type: data.identificationType,
  //         identification_number: data.identificationNumber,
  //         phone_number: data.phoneNumber,
  //         nationality: data.nationality,
  //         birth_date: data.birthDate,
  //         email_address: data.emailAddress,
  //         country: data.country,
  //         state: data.state,
  //         city: data.city,
  //         sector: data.sector,
  //         street: data.street,
  //         residency_number: data.residencyNumber,
  //         income_source: data.incomeSource,
  //         commercial_registry: data.commercialRegistry,
  //         commercial_activity_type: data.commercialActivityType,
  //         commercial_activity_commentary: data.commercialActivityCommentary,
  //         employer_type: data.employerType,
  //         economic_sector: data.economicSector,
  //         company_type: data.companyType,
  //         company_funds_origin: data.companyFundsOrigin,
  //         company_private_pct: data.companyPrivatePct,
  //         company_public_pct: data.companyPublicPct,
  //         is_pep: data.isPep,
  //         is_politician: data.isPolitician,
  //         is_politician_relative: data.isPoliticianRelative,
  //         created_by: data.createdBy,
  //         last_modified_by: data.lastModifiedBy,
  //       }).then((createdBeneficiary) => {
  //         return createdBeneficiary.dataValues;
  //       });
  //     });
  //   }

  //   async function update(beneficiaryId, data) {
  //     return Beneficiary.update(
  //       {
  //         beneficiary_name: data.beneficiaryName,
  //         beneficiary_type: data.beneficiaryType,
  //         identification_type: data.identificationType,
  //         identification_number: data.identificationNumber,
  //         phone_number: data.phoneNumber,
  //         nationality: data.nationality,
  //         birth_date: data.birthDate,
  //         email_address: data.emailAddress,
  //         country: data.country,
  //         state: data.state,
  //         city: data.city,
  //         sector: data.sector,
  //         street: data.street,
  //         residency_number: data.residencyNumber,
  //         income_source: data.incomeSource,
  //         commercial_registry: data.commercialRegistry,
  //         commercial_activity_type: data.commercialActivityType,
  //         commercial_activity_commentary: data.commercialActivityCommentary,
  //         employer_type: data.employerType,
  //         economic_sector: data.economicSector,
  //         company_type: data.companyType,
  //         company_funds_origin: data.companyFundsOrigin,
  //         company_private_pct: data.companyPrivatePct,
  //         company_public_pct: data.companyPublicPct,
  //         is_pep: data.isPep,
  //         is_politician: data.isPolitician,
  //         is_politician_relative: data.isPoliticianRelative,
  //         created_by: data.createdBy,
  //         last_modified_by: data.lastModifiedBy,
  //       },
  //       {
  //         where: {
  //           beneficiary_id: beneficiaryId,
  //         },
  //       }
  //     ).then((beneficiary) => {
  //       return beneficiary;
  //     });
  //   }

  // async function update(id, data) {
  //   //Validate if the beneficiary is not being used by any other entity
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
  };
};
