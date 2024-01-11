module.exports = (sequelize, Sequelize) => {
  const Record = sequelize.define(
    "record",
    {
      record_id: {
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      record_code: {
        type: Sequelize.STRING,
      },
      customer_id: {
        type: Sequelize.STRING,
      },
      number_of_partners: {
        type: Sequelize.INTEGER,
      },
      status_type: {
        type: Sequelize.STRING,
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

  return Record;
};
