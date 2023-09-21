const { v4: uuidv4 } = require("uuid");
const { getCurrentDate } = require("../../utils");

const userProfileModel = (data, mode) => {
  let user = {
    first_name: data.firstName || "",
    last_name: data.lastName || "",
    email: data.email || "",
    phone_number: data.phoneNumber || "",
    secondary_phone_number: data.secondaryPhoneNumber || "",
    address: data.address || "",
  };

  switch (mode) {
    case "create":
      user = {
        user_profile_id: uuidv4(),
        ...user,
        status: "CREATED",
        modified_by: data.modifiedBy || "",
        modified_at: getCurrentDate(),
        created_by: data.createdBy || "",
        created_at: getCurrentDate(),
      };
      break;

    case "update":
      user = {
        ...user,
        status: data.status || "",
        modified_by: data.modifiedBy || "",
        modified_at: data.modifiedAt || "",
      };
      break;
    case "find":
      user = {
        user_profile_id: data.userProfileId || "",
        ...user,
        status: data.status || "",
        modified_by: data.modifiedBy || "",
        modified_at: data.modifiedAt || "",
        created_by: data.createdBy || "",
        created_at: data.createdAt || "",
      };
      break;
    default:
      break;
  }

  // let user = {
  //   user_profile_id: isNew ? uuidv4() : data.userProfileId || "",
  //   first_name: data.firstName || "",
  //   last_name: data.lastName || "",
  //   email: data.email || "",
  //   phone_number: data.phoneNumber || "",
  //   secondary_phone_number: data.secondaryPhoneNumber || "",
  //   address: data.address || "",
  //   status: data.status || "CREATED",
  //   modified_by: data.modifiedBy || "",
  //   modified_at:
  //     data.modifiedAt === undefined ? getCurrentDate() : data.modifiedAt,
  // };

  // let defaultFields = {
  //   created_by: data.createdBy || "",
  //   created_at: getCurrentDate(),
  // };

  // if (isNew) {
  //   user = {
  //     ...user,
  //     ...defaultFields,
  //   };
  // }

  return user;
};

module.exports = {
  userProfileModel,
};
