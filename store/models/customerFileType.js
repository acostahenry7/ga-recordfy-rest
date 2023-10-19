const { v4: uuidv4 } = require("uuid");

const customerTypeFileModel = (data, mode) => {
  let customerTypeFile = {};

  switch (mode) {
    case "create":
      customerTypeFile = {
        customer_type_file_id: uuidv4(),
        customer_type_id: data.fileTypeId,
        file_type_id: data.fileTypeId,
        status: "CREATED",
      };
      break;

    case "update":
      customerTypeFile = {
        customer_type_file_id: data.customerTypeFileId || "",
        customer_type_id: data.customerTypeFileId || "",
        file_type_id: data.fileTypeId || "",
        status: data.status || "",
      };
      break;
    case "find":
      customerTypeFile = {
        customer_type_file_id: data.customerTypeFileId || "",
        customer_type_id: data.fileTypeId || "",
        file_type_id: data.fileTypeId || "",
        status: data.status || "",
      };
      break;
    default:
      break;
  }

  return customerTypeFile;
};

module.exports = { customerTypeFileModel };
