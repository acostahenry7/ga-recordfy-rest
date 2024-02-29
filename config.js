module.exports = {
  app: {
    port: process.env.GARECORDFY_PORT || 3001, //Backend main api port
    wsport: process.env.GARECORDFY_WS_PORT || 3002, //Websocket port for notifications
    storage: {
      port: 19605, //Static files storage port
    },
    verficationEmails: [
      //"gf.cavagliano@grupoavant.com.do",
      "h.acosta@grupoavant.com.do",
      "acostahenry7@gmail.com",
    ],
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
