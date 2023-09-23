const { v4: uuidv4 } = require("uuid");
const { getCurrentDate } = require("../../utils");

const customerTypeModel = (data, mode) => {
  let customerType = {
    name: data.name || "",
  };

  switch (mode) {
    case "create":
      customerType = {
        customer_type_id: uuidv4(),
        ...customerType,
        status: "CREATED",
        modified_by: data.modifiedBy || "",
        modified_at: getCurrentDate(),
        created_by: data.createdBy || "",
        created_at: getCurrentDate(),
      };
      break;

    case "update":
      customerType = {
        ...customerType,
        status: data.status || "",
        modified_by: data.modifiedBy || "",
        modified_at: data.modifiedAt || "",
      };
      break;
    case "find":
      customerType = {
        customer_type_id: data.customerTypeId || "",
        ...customerType,
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

  return customerType;
};

module.exports = { customerTypeModel };
