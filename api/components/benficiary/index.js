const controller = require("./controller");
const store = require("../../../store/postgres");

module.exports = controller(store);
