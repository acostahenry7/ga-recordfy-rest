const TABLE = "customer_type_file";
const {
  customerTypeFileModel,
} = require("../../../store/models/customerFileType");

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  async function list() {
    return store.list(TABLE, customerTypeFileModel({}, "find"));
  }

  async function get(data) {
    const customerTypeFile = await store.get(
      TABLE,
      customerTypeFileModel(data, "find")
    );

    if (customerTypeFile.length > 0) {
      return customerTypeFile;
    } else {
      throw new Error("CustomerTypeFile not found");
    }
  }

  async function insert(data) {
    const customerTypeFile = await store.get(
      TABLE,
      customerTypeFileModel(data, "find")
    );

    if (customerTypeFile.length > 0) {
      throw new Error("CustomerTypeFile already exists!");
    } else {
      return store.insert(TABLE, customerTypeFileModel(data, "create"));
    }
  }

  async function update(id, data) {
    //Validate if the customerTypeFile is not being used by any other entity
    const customerTypeFile = await store.get(
      TABLE,
      customerTypeFileModel(
        { customerTypeFileId: id, status: "CREATED" },
        "find"
      )
    );

    if (customerTypeFile.length > 0) {
      return store.update(TABLE, id, customerTypeFileModel(data, "update"));
    } else {
      throw new Error("CustomerTypeFile not found!");
    }
  }

  return {
    list,
    get,
    insert,
    update,
  };
};
