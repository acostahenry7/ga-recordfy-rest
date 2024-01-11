module.exports = {
  app: {
    port: process.env.RECORDFY_PORT || 3001,
  },
  db: {
    host: "localhost",
    user: "postgres",
    password: "postgres",
    dbname: "garecordfy",
    dialect: "postgres",
    keepDefaultTimezone: true,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  security: {
    secret: process.env.JWT_SCRET || "have-to-create-a-secret!",
  },
};
