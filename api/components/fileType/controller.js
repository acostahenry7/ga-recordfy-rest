const TABLE = "file_type";
const { fileTypeModel } = require("../../../store/models/fileType");

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  async function list() {
    return store.list(TABLE, fileTypeModel({}, "find"));
  }

  async function get(data) {
    const fileType = await store.get(TABLE, fileTypeModel(data, "find"));

    if (fileType.length > 0) {
      return fileType;
    } else {
      throw new Error("fileType not found");
    }
  }

  async function insert(data) {
    const fileType = await store.get(
      TABLE,
      fileTypeModel({ ...data, status: "CREATED" }, "find")
    );

    if (fileType.length > 0) {
      throw new Error("fileType already exists!");
    } else {
      return store.insert(TABLE, fileTypeModel(data, "create"));
    }
  }

  async function update(id, data) {
    //Validate if the fileType is not being used by any other entity
    const fileType = await store.get(
      TABLE,
      fileTypeModel({ fileTypeId: id, status: "CREATED" }, "find")
    );

    if (fileType.length > 0) {
      return store.update(TABLE, id, fileTypeModel(data, "update"));
    } else {
      throw new Error("fileType not found!");
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
