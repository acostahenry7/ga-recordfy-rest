module.exports = (sequelize, Sequelize) => {
  const BeneficiaryFileType = sequelize.define(
    "beneficiary_type_file",
    {
      beneficiary_type_file_id: {
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      file_type_id: {
        type: Sequelize.STRING,
      },
      beneficiary_type: {
        type: Sequelize.STRING,
      },
      status_type: {
        type: Sequelize.STRING,
      },
    },
    {
      schema: "public",
      freezeTableName: true,
      underscored: true,
      timestamps: false,
    }
  );

  return BeneficiaryFileType;
};
