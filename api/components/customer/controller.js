const TABLE = "customer";
const { customerModel } = require("../../../store/models/customer");

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  async function list() {
    return store.list(TABLE, customerModel({}, "find"));
  }

  async function get(data) {
    const customer = await store.get(TABLE, customerModel(data, "find"));

    if (customer.length > 0) {
      return customer;
    } else {
      throw new Error("customer not found");
    }
  }

  async function insert(data) {
    const customer = await store.get(
      TABLE,
      customerModel({ ...data, status: "CREATED" }, "find")
    );

    if (customer.length > 0) {
      throw new Error("customer already exists!");
    } else {
      return store.insert(TABLE, customerModel(data, "create"));
    }
  }

  async function update(id, data) {
    //Validate if the customer is not being used by any other entity
    const customer = await store.get(
      TABLE,
      customerModel({ customerId: id, status: "CREATED" }, "find")
    );

    if (customer.length > 0) {
      return store.update(TABLE, id, customerModel(data, "update"));
    } else {
      throw new Error("customer not found!");
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
