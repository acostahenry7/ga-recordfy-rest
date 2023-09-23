const { decodeToken } = require("../../../auth");
const error = require("../../../utils/error");

function isOwner(req, res, next) {
  console.log(req.headers.authorization);
  console.log("DECODED TOKEN", decodeToken(req.headers.authorization));

  const owner = decodeToken(req.headers.authorization);

  console.log(owner);
  if (req.params.id !== owner.user_profile_id) {
    throw error("Invalid authorization", 401);
  }
  next();
}

module.exports = {
  isOwner,
};
