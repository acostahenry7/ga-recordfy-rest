const TABLE = "customer_type";
const { customerTypeModel } = require("../../../store/models/customerType");

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  async function list() {
    return store.list(TABLE, customerTypeModel({}, "find"));
  }

  async function get(data) {
    const customerType = await store.get(
      TABLE,
      customerTypeModel(data, "find")
    );

    if (customerType.length > 0) {
      return customerType;
    } else {
      throw new Error("CustomerType not found");
    }
  }

  async function insert(data) {
    const customerType = await store.get(
      TABLE,
      customerTypeModel({ ...data, status: "CREATED" }, "find")
    );

    if (customerType.length > 0) {
      throw new Error("CustomerType already exists!");
    } else {
      return store.insert(TABLE, customerTypeModel(data, "create"));
    }
  }

  async function update(id, data) {
    //Validate if the customerType is not being used by any other entity
    const customerType = await store.get(
      TABLE,
      customerTypeModel({ customerTypeId: id, status: "CREATED" }, "find")
    );

    if (customerType.length > 0) {
      return store.update(TABLE, id, customerTypeModel(data, "update"));
    } else {
      throw new Error("CustomerType not found!");
    }
  }

  //async function

  return {
    list,
    get,
    insert,
    update,
  };
};
