const { v4: uuidv4 } = require("uuid");
const { getCurrentDate } = require("../../utils");

const recordFileModel = (data, mode) => {
  let recordFile = {
    name: data.name || "",
    expiration_date: data.expirationDate || "",
    record_id: data.recordId || "",
    file_type_id: data.fileTypeId || "",
  };

  switch (mode) {
    case "create":
      recordFile = {
        record_file_id: uuidv4(),
        ...recordFile,
        status: "CREATED",
        modified_by: data.modifiedBy || "",
        modified_at: getCurrentDate(),
        created_by: data.createdBy || "",
        created_at: getCurrentDate(),
      };
      break;

    case "update":
      recordFile = {
        ...recordFile,
        status: data.status || "",
        modified_by: data.modifiedBy || "",
        modified_at: data.modifiedAt || "",
      };
      break;
    case "find":
      recordFile = {
        record_file_id: data.recordFileId || "",
        ...recordFile,
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

  return recordFile;
};

module.exports = { recordFileModel };
