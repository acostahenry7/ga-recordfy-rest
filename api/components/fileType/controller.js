const error = require("../../../utils/error");
const db = require("../../../store/models");
const FileType = db.fileType;
const RecordFile = db.recordFile;
const Beneficiary = db.beneficiary;
const BeneficiaryFileType = db.beneficiaryFileType;
const Op = db.op;

module.exports = function (injectedStore) {
  // let store = injectedStore;
  // if (!store) {
  //   store = require("../../../store/dummy");
  // }

  // async function list() {
  //   return store.list(TABLE, fileTypeModel({}, "find"));
  // }

  async function get(data) {
    return FileType.findAll({
      where: {
        status_type: {
          [Op.notLike]: "DELETED",
        },
      },
    })
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

  async function remove(id) {
    let foundFiles = await RecordFile.findAll({
      where: {
        file_type_id: id,
        status_type: {
          [Op.notLike]: "DELETED",
        },
      },
      include: [Beneficiary],
    });

    if (foundFiles.length > 0) {
      throw error(
        JSON.stringify({
          msg: "Estos archivos hacen uso de este tipo de archivo",
          detail: foundFiles,
        }),
        406
      );
    }

    return FileType.update(
      {
        status_type: "DELETED",
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

  // FileType.update(
  //   {
  //     status_type: "DELETE",
  //   },
  //   {
  //     where: {
  //       file_type_id: id,
  //     },
  //   }
  // )
  //   .then((fileType) => {
  //     return fileType;
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     throw error(err);
  //   });

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
    remove,
  };
};
