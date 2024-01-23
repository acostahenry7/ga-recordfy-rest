const db = require("../../../store/models");

//Sequelize Models
const Customer = db.customer;
const Record = db.record;
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
    console.log(data);
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
    console.log(data);
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
      }).then((createdCustomer) => {
        return createdCustomer.dataValues;
      });
    });
  }

  async function update(customerId, data) {
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
  };
};
