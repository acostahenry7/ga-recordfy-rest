const auth = require("../../../auth");

const canList = (req, res, next) => {
  auth.verify(req.headers.authorization);
  next();
};

module.exports = {
  canList,
};
