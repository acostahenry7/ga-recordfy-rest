const TABLE = "user_profile";
const { v4: uuidv4 } = require("uuid");
const { userProfileModel } = require("../../../store/models/user");
const error = require("../../../utils/error");

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  function list() {
    return store.list(TABLE, userProfileModel({}, "find"));
  }

  function get(queryParams) {
    // console.log(queryParams);
    const conditions = userProfileModel(queryParams, "find");
    console.log(conditions);

    return store.get(TABLE, conditions);
  }

  async function insert(data) {
    const userProfileId = uuidv4();

    let user = await store.get("auth", { username: data.username });

    if (user.length > 0) {
      console.log("hiiiiiii");
      return new Promise((resolve, reject) =>
        reject(new Error("User already exists!"))
      );
    } else {
      return store.insert(TABLE, userProfileModel(data, userProfileId));
    }
    // console.log({
    //   authModel: authModel(data, userProfileId),
    //   userProfileModel: userProfileModel(data, userProfileId),
    // });
    // store.insert("auth", authModel(data, userProfileId));

    // return
  }

  async function update(id, data) {
    const userProfile = await store.get(
      TABLE,
      userProfileModel({ userProfileId: id }, "find")
    );

    if (userProfile.length > 0) {
      return store.update(TABLE, id, userProfileModel(data, "update"));
    } else {
      throw error("User does not exists!", 400);
    }
  }

  function remove(id) {
    return store.remove(TABLE, id);
  }

  return {
    list,
    get,
    insert,
    update,
    remove,
  };
};
