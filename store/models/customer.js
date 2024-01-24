module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define(
    "customer",
    {
      customer_id: {
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      customer_name: {
        type: Sequelize.STRING,
      },
      customer_type: {
        type: Sequelize.STRING,
      },
      identification_type: {
        type: Sequelize.STRING,
      },
      identification_number: {
        type: Sequelize.STRING,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      nationality: {
        type: Sequelize.STRING,
      },
      birth_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      email_address: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      sector: {
        type: Sequelize.STRING,
      },
      street: {
        type: Sequelize.STRING,
      },
      residency_number: {
        type: Sequelize.STRING,
      },
      income_source: {
        type: Sequelize.STRING,
      },
      commercial_registry: {
        type: Sequelize.STRING,
      },
      commercial_activity_type: {
        type: Sequelize.STRING,
      },
      commercial_activity_commentary: {
        type: Sequelize.STRING,
      },
      employer_type: {
        type: Sequelize.STRING,
      },
      economic_sector: {
        type: Sequelize.STRING,
      },
      company_type: {
        type: Sequelize.STRING,
      },
      company_funds_origin: {
        type: Sequelize.STRING,
      },
      company_private_pct: {
        type: Sequelize.STRING,
      },
      company_public_pct: {
        type: Sequelize.STRING,
      },
      company_economic_sector: {
        type: Sequelize.STRING,
      },
      risk_level: {
        type: Sequelize.STRING,
      },
      is_pep: {
        type: Sequelize.BOOLEAN,
      },
      is_politician: {
        type: Sequelize.BOOLEAN,
      },
      is_politician_relative: {
        type: Sequelize.BOOLEAN,
      },
      created_by: {
        type: Sequelize.STRING,
      },
      last_modified_by: {
        type: Sequelize.STRING,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      last_modified_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      schema: "public",
      freezeTableName: true,
      underscored: true,
      timestamps: false,
    }
  );

  return Customer;
};
