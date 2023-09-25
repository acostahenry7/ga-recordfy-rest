const TABLE = "record";
const { recordModel } = require("../../../store/models/record");
const { customerModel } = require("../../../store/models/customer");

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  async function list() {
    return store.list(TABLE, recordModel({}, "find"));
  }

  async function get(data) {
    const record = await store.get(TABLE, recordModel(data, "find"));

    if (record.length > 0) {
      return record;
    } else {
      throw new Error("record not found");
    }
  }

  async function insert(data) {
    const record = await store.get(
      TABLE,
      recordModel({ ...data, status: "CREATED" }, "find")
    );

    if (record.length > 0) {
      throw new Error("record already exists!");
    } else {
      const recordCustomer = await store.get(
        "customer",
        customerModel({ customerId: data.customerId }, "find")
      );

      if (recordCustomer === undefined || recordCustomer.length === 0) {
        throw new Error("Invalid customer");
      } else {
        return store.insert(TABLE, recordModel(data, "create"));
      }
    }
  }

  async function update(id, data) {
    //Validate if the record is not being used by any other entity
    const record = await store.get(
      TABLE,
      recordModel({ recordId: id, status: "CREATED" }, "find")
    );

    if (record.length > 0) {
      return store.update(TABLE, id, recordModel(data, "update"));
    } else {
      throw new Error("record not found!");
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
