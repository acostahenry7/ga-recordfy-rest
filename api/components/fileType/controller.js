const error = require("../../../network/errors");
const db = require("../../../store/models");
const FileType = db.fileType;

module.exports = function (injectedStore) {
  // let store = injectedStore;
  // if (!store) {
  //   store = require("../../../store/dummy");
  // }

  // async function list() {
  //   return store.list(TABLE, fileTypeModel({}, "find"));
  // }

  async function get(data) {
    return FileType.findAll()
      .then((fileType) => {
        return fileType;
      })
      .catch((err) => {
        throw error(err);
      });
  }

  async function insert(data) {
    return FileType.create({
      name: data.name,
      prefix: data.prefix,
      status_type: "CREATED",
      created_by: data.createdBy,
      last_modified_by: data.lastModifiedBy,
    })
      .then((fileType) => {
        return fileType;
      })
      .catch((err) => {
        console.log(err);
        throw error(err);
      });
  }

  async function update(id, data) {
    console.log(id);
    return FileType.update(
      {
        name: data.name,
        prefix: data.prefix,
        last_modified_by: data.lastModifiedBy,
      },
      {
        where: {
          file_type_id: id,
        },
      }
    )
      .then((fileType) => {
        return fileType;
      })
      .catch((err) => {
        console.log(err);
        throw error(err);
      });
  }

  // async function update(id, data) {
  //   //Validate if the fileType is not being used by any other entity
  //   const fileType = await store.get(
  //     TABLE,
  //     fileTypeModel({ fileTypeId: id, status: "CREATED" }, "find")
  //   );

  //   if (fileType.length > 0) {
  //     return store.update(TABLE, id, fileTypeModel(data, "update"));
  //   } else {
  //     throw new Error("fileType not found!");
  //   }
  // }

  return {
    get,
    insert,
    update,
  };
};
