module.exports = {
  app: {
    port: process.env.RECORDFY_PORT || 3001,
  },
  db: {
    host: "localhost",
    user: "postgres",
    password: "postgres",
    db: "garecordfy",
    dialect: "postgres",
    timezone: "-04:00",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
