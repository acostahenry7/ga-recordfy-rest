const TABLE = "record";
const { recordModel } = require("../../../store/models/record");
const { customerModel } = require("../../../store/models/customer");

const { listDetailedRecords } = require("../../../store/queries/record");

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  async function list() {
    // const record = await store.list(TABLE, recordModel({}, "find"), {
    //   joinTable: "customer",
    //   joinBy: "customer_id",
    //   joinConditions: customerModel({}, "find"),
    // });

    const record = await store.getCustomQuery(listDetailedRecords);

    console.log(record);
    const response = [...record];
    return response;
  }

  async function get(data) {
    // const record = await store.getCustomQuery(TABLE, recordModel(data, "find"), {
    //   joinTables: [
    //     {
    //       name: "customer",
    //       joinBy: "customer_id",
    //       joinConditions: customerModel(data, "find"),
    //     },
    //     // {
    //     //   name: "record_file",
    //     //   joinWith: "",
    //     //   joinBy: "record_id",
    //     //   joinConditions: recordFileModel(data, "find"),
    //     // },
    //   ],
    // });

    const record = await store.getCustomQuery(
      listDetailedRecords({ ...recordModel(data), ...customerModel(data) })
    );

    console.log(record);
    const response = [...record];

    if (record.length > 0) {
      return record;
    } else {
      throw new Error("record not found");
    }
  }

  async function insert(data) {
    const record = await store.get(TABLE, recordModel({ ...data }, "find"));

    console.log(recordModel({ ...data }));

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
