const db = require("../../../store/models");
const Record = db.record;
const RecordFile = db.recordFile;
const error = require("../../../network/errors");

module.exports = function (injectedStore) {
  async function get(data) {
    return Record.findAll({
      include: RecordFile,
    })
      .then((record) => {
        return record;
      })
      .catch((err) => {
        throw error(err);
      });
  }

  async function insert(data) {
    Record.create({
      record_code: data.recordCode,
      customer_id: data.customerId,
      number_of_partners: data.numberOfPartners,
      status_type: "CREATED",
      created_by: data.createdBy,
      last_modified_by: data.lastModifiedBy,
    })
      .then((record) => {
        return record;
      })
      .catch((err) => {
        console.log(err);
        throw error(err);
      });
  }

  // async function update(id, data) {
  //   //Validate if the record is not being used by any other entity
  //   const record = await store.get(
  //     TABLE,
  //     recordModel({ recordId: id, status: "CREATED" }, "find")
  //   );

  //   if (record.length > 0) {
  //     return store.update(TABLE, id, recordModel(data, "update"));
  //   } else {
  //     throw new Error("record not found!");
  //   }
  // }

  //async function

  return {
    get,
    insert,
    // update,
  };
};
