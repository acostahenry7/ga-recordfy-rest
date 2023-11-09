const TABLE = "record_file";
const { recordFileModel } = require("../../../store/models/recordFile");
const { recordModel } = require("../../../store/models/record");
const { fileTypeModel } = require("../../../store/models/fileType");
const {
  listDetailedRecordFiles,
} = require("../../../store/queries/recordFile");

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  async function list() {
    return await store.getCustomQuery(
      listDetailedRecordFiles(recordFileModel(data, "find"))
    );
  }

  async function get(data) {
    // const recordFile = await store.get(TABLE, recordFileModel(data, "find"));
    const recordFile = await store.getCustomQuery(
      listDetailedRecordFiles(recordFileModel(data, "find"))
    );

    if (recordFile.length > 0) {
      return recordFile;
    } else {
      throw new Error("recordFile not found");
    }
  }

  async function insert(data) {
    console.log("RECORD FILE******************", data);
    const recordFile = await store.get(
      TABLE,
      recordFileModel({ name: data.name, status: "CREATED" }, "find")
    );

    if (recordFile.length > 0 && recordFile[0].record_id === data.recordId) {
      throw new Error("recordFile already exists!");
    } else {
      const targetRecord = await store.get(
        "record",
        recordModel({ recordId: data.recordId }, "find")
      );
      const targetFileType = await store.get(
        "file_type",
        fileTypeModel({ fileTypeId: data.fileTypeId }, "find")
      );

      if (targetRecord === undefined || targetRecord.length === 0) {
        throw new Error("Invalid record");
      }

      if (targetFileType === undefined || targetFileType.length === 0) {
        throw new Error("Invalid fileType");
      }

      return store.insert(TABLE, recordFileModel(data, "create"));
    }
  }

  async function update(id, data) {
    //Validate if the recordFile is not being used by any other entity
    const recordFile = await store.get(
      TABLE,
      recordFileModel({ recordFileId: id, status: "CREATED" }, "find")
    );

    if (recordFile.length > 0) {
      return store.update(TABLE, id, recordFileModel(data, "update"));
    } else {
      throw new Error("recordFile not found!");
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
