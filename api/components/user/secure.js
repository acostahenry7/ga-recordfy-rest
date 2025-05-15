const { decodeToken } = require("../../../auth");
const error = require("../../../utils/error");

function isOwner(req, res, next) {
  const owner = decodeToken(req.headers.authorization);

  if (req.params.id !== owner.user_profile_id) {
    throw error("Invalid authorization", 401);
  }
  next();
}

module.exports = {
  isOwner,
};
