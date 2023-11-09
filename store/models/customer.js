const { v4: uuidv4 } = require("uuid");
const { getCurrentDate } = require("../../utils");

const customerModel = (data, mode) => {
  let customer = {
    customer_name: data.customerName || "",
    identification_number: data.identificationNumber || "",
    phone_number: data.phoneNumber || "",
    address: data.address || "",
    customer_type_id: data.customerTypeId || "",
  };

  switch (mode) {
    case "create":
      customer = {
        customer_id: uuidv4(),
        ...customer,
        status: "CREATED",
        modified_by: data.modifiedBy || "",
        modified_at: getCurrentDate(),
        created_by: data.createdBy || "",
        created_at: getCurrentDate(),
      };
      break;

    case "update":
      customer = {
        ...customer,
        status: data.status || "",
        modified_by: data.modifiedBy || "",
        modified_at: data.modifiedAt || "",
      };
      break;
    case "find":
      customer = {
        customer_id: data.customerId || "",
        ...customer,
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

  return customer;
};

module.exports = { customerModel };
