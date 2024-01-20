const error = require("../../../network/errors");
const db = require("../../../store/models");
const BeneficiaryTypeFile = db.beneficiaryFileType;
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
    return BeneficiaryTypeFile.findAll({
      include: FileType,
    })
      .then((beneficiaryTypeFile) => {
        return beneficiaryTypeFile;
      })
      .catch((err) => {
        throw error(err);
      });
  }

  async function insert(data) {
    return BeneficiaryTypeFile.bulkCreate(data.bTypeFiles)
      .then((bft) => {
        return bft;
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
  };
};
