const auth = require("../../../auth");

const verifyToken = (req, res, next) => {
  auth.verify(req.headers.authorization);
  next();
};

module.exports = {
  canList,
};
