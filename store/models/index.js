const { Sequelize, Op } = require("sequelize");
const config = require("../../config");

const pg = require("pg");
pg.types.setTypeParser(1114, (str) => new Date(str.split(" ").join("T") + "Z"));
const sequelize = new Sequelize(
  config.db.dbname,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    operatorsAliases: false,
    timezone: "-04:00",
    pool: {
      max: config.db.pool.max,
      min: config.db.pool.min,
      acquire: config.db.pool.acquire,
      idle: config.db.pool.idle,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.op = Op;

db.auth = require("../models/auth")(sequelize, Sequelize);
db.userProfile = require("../models/userProfile")(sequelize, Sequelize);
db.beneficiary = require("../models/beneficiary")(sequelize, Sequelize);
db.beneficiaryFileType = require("../models/beneficiaryFileType")(
  sequelize,
  Sequelize
);
db.customer = require("../models/customer")(sequelize, Sequelize);
db.fileType = require("../models/fileType")(sequelize, Sequelize);
db.record = require("../models/record")(sequelize, Sequelize);
db.recordFile = require("../models/recordFile")(sequelize, Sequelize);

db.record.hasOne(db.recordFile, {
  foreignKey: "record_id",
});

db.recordFile.belongsTo(db.record, {
  foreignKey: "record_id",
});

// db.payment.hasOne(db.receipt, {
//   foreignKey: "payment_id",
// });
// db.receipt.belongsTo(db.payment, {
//   foreignKey: "payment_id",
// });

module.exports = db; //Primero crear los modelos antes de hacer el sync force
