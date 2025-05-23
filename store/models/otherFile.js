module.exports = (sequelize, Sequelize) => {
  const OtherFile = sequelize.define(
    "other_file",
    {
      other_file_id: {
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
      },
      record_id: {
        type: Sequelize.STRING,
      },
      file_type_id: {
        type: Sequelize.STRING,
      },
      source: {
        type: Sequelize.STRING,
      },
      expiration_date: {
        type: Sequelize.DATE,
      },
      doc_creation_date: {
        type: Sequelize.DATE,
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

  return OtherFile;
};
