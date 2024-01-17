module.exports = (sequelize, Sequelize) => {
  const FileType = sequelize.define(
    "file_type",
    {
      file_type_id: {
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
      },
      prefix: {
        type: Sequelize.STRING,
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

  return FileType;
};
