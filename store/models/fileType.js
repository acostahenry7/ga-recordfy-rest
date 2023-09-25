const { v4: uuidv4 } = require("uuid");
const { getCurrentDate } = require("../../utils");

const fileTypeModel = (data, mode) => {
  let fileType = {
    name: data.name || "",
    prefix: data.prefix || "",
  };

  switch (mode) {
    case "create":
      fileType = {
        file_type_id: uuidv4(),
        ...fileType,
        status: "CREATED",
        modified_by: data.modifiedBy || "",
        modified_at: getCurrentDate(),
        created_by: data.createdBy || "",
        created_at: getCurrentDate(),
      };
      break;

    case "update":
      fileType = {
        ...fileType,
        status: data.status || "",
        modified_by: data.modifiedBy || "",
        modified_at: data.modifiedAt || "",
      };
      break;
    case "find":
      fileType = {
        file_type_id: data.fileTypeId || "",
        ...fileType,
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

  return fileType;
};

module.exports = { fileTypeModel };
