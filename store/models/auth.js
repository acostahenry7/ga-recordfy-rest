module.exports = (sequelize, Sequelize) => {
  const Auth = sequelize.define(
    "auth",
    {
      auth_id: {
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      user_profile_id: {
        type: Sequelize.STRING,
      },
      verified: {
        type: Sequelize.BOOLEAN,
      },
      verification_token: {
        type: Sequelize.STRING,
      },
      can_signin: {
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

  return Auth;
};
