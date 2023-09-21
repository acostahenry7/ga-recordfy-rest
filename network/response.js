function success(req, res, message, status) {
  let statusCode = status || 200;
  let bodyMessage = message || {};

  res.status(statusCode).send({
    error: false,
    status: statusCode,
    body: bodyMessage,
  });
}

function error(req, res, message, status) {
  let statusCode = status || 500;
  let bodyMessage = message || "Internal Server Error";

  res.status(statusCode).send({
    error: true,
    status: statusCode,
    body: bodyMessage,
  });
}

module.exports = {
  success,
  error,
};
