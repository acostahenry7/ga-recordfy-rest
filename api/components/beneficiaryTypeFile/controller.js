const error = require("../../../utils/error");
const db = require("../../../store/models");
const BeneficiaryTypeFile = db.beneficiaryFileType;
const FileType = db.fileType;
const RecordFile = db.recordFile;
const Beneficiary = db.beneficiary;
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
    return BeneficiaryTypeFile.findAll({
      where: {
        status_type: {
          [Op.notLike]: "DELETED",
        },
      },
      include: [FileType],
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

  async function remove(id, data) {
    let foundFiles = await RecordFile.findAll({
      where: {
        file_type_id: data.file_type_id,
        status_type: {
          [Op.notLike]: "DELETED",
        },
      },
      include: [Beneficiary],
    });

    console.log(foundFiles);

    if (foundFiles.length > 0) {
      throw error(
        JSON.stringify({
          msg: "Estos archivos hacen uso de este tipo de archivo",
          detail: foundFiles,
        }),
        406
      );
    }

    return BeneficiaryTypeFile.update(
      {
        status_type: "DELETED",
      },
      {
        where: {
          beneficiary_type_file_id: id,
        },
      }
    )
      .then((bFileType) => {
        return bFileType;
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
    remove,
  };
};
