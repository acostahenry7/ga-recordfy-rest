const { v4: uuidv4 } = require("uuid");
const { getCurrentDate } = require("../../utils");

const recordModel = (data, mode) => {
  let record = {
    record_code: data.recordCode || "",
    customer_id: data.customerId || "",
    number_of_partners: data.numberOfPartners || "",
  };

  switch (mode) {
    case "create":
      record = {
        record_id: uuidv4(),
        ...record,
        status: "CREATED",
        modified_by: data.modifiedBy || "",
        modified_at: getCurrentDate(),
        created_by: data.createdBy || "",
        created_at: getCurrentDate(),
      };
      break;

    case "update":
      record = {
        ...record,
        status: data.status || "",
        modified_by: data.modifiedBy || "",
        modified_at: data.modifiedAt || "",
      };
      break;
    case "find":
      record = {
        record_id: data.recordId || "",
        ...record,
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

  return record;
};

module.exports = { recordModel };
