const response = require("./response");

function errors(err, req, res, next) {
  //console.log(res);
  console.error("[error]", err);

  const message = err.message || "Internal Server Error";
  const status = err.statusCode || 500;

  console.log(status);
  response.error(req, res, message, status);
}

module.exports = errors;
