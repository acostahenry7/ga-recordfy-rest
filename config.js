module.exports = {
  app: {
    port: process.env.GARECORDFY_PORT || 3001,
    wsport: process.env.GARECORDFY_WS_PORT || 3002,
    storage: {
      port: 19605,
    },
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
