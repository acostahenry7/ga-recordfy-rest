module.exports = (sequelize, Sequelize) => {
  const Beneficiary = sequelize.define(
    "beneficiary",
    {
      beneficiary_id: {
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      record_id: {
        type: Sequelize.INTEGER,
      },
      order: {
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      identification_number: {
        type: Sequelize.STRING,
      },
      nationality: {
        type: Sequelize.STRING,
      },
      stocks_percentage: {
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
    },
    {
      schema: "public",
      freezeTableName: true,
      underscored: true,
      timestamps: false,
    }
  );

  return Beneficiary;
};
