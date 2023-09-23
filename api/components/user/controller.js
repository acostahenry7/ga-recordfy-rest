const TABLE = "user_profile";
const { v4: uuidv4 } = require("uuid");
const { userProfileModel } = require("../../../store/models/user");

//User model
const authModel = (data, id) => {
  return {
    auth_id: uuidv4(),
    username: data.username,
    password: data.password,
    user_profile_id: id,
  };
};

//La lógica de negocio va a aquí

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

  function remove(id) {
    return store.remove(TABLE, id);
  }

  return {
    list,
    get,
    insert,
    remove,
  };
};
