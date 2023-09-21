const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

function authModel(data, isNew) {
  return {
    auth_id: isNew ? uuidv4() : data.authId || "",
    username: data.username || "",
    password: isNew ? bcrypt.hashSync(data.password || "", 8) : "",
    user_profile_id: data.userProfileId || "",
    verified: isNew ? false : data.verified || false,
    verification_token: data.verificationToken || "",
  };
}

module.exports = {
  authModel,
};
