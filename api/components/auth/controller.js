const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const TABLE = "auth";
const verification = require("../../../template/email/verification");
const { authModel } = require("../../../store/models/auth");
const { userProfileModel } = require("../../../store/models/user");
const bcrypt = require("bcryptjs");
const error = require("../../../utils/error");

const auth = require("../../../auth");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "grupoavant.tablet@gmail.com",
    pass: "mftyrvghgoreuzfp",
  },
});

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  async function signup(data) {
    let userProfile = await store.get(
      TABLE,
      authModel({ username: data.username })
    );

    if (userProfile.length > 0) {
      return new Promise((resolve, reject) =>
        reject(new Error("User already exists!"))
      );
    } else {
      const verificationToken = uuidv4();

      userProfile = await store.insert(
        "user_profile",
        userProfileModel(data, "create")
      );

      console.log(userProfile);

      store.insert(
        TABLE,
        authModel(
          {
            ...data,
            verificationToken,
            userProfileId: userProfile.user_profile_id,
          },
          true
        )
      );

      let queryParams = "";
      let verificationParams = {
        username: data.username,
        verificationToken,
      };

      for (entry of Object.entries(verificationParams)) {
        key = entry[0];
        value = entry[1];
        queryParams += `${key}=${value}&`;
      }

      const mailOptions = {
        from: "GaRecordfy <grupoavant.tablet@gmail.com>",
        to: data.email,
        subject: "Confirmación de Creación de Cuenta GaRecordfy",
        html: verification({ ...data, queryParams }),
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          throw new Error(error);
        } else {
          console.log(info);
        }
      });

      return store.get(
        "user_profile",
        userProfileModel({ userProfileId: userProfile.user_profile_id }, "find")
      );
    }
  }

  async function signin(data) {
    const authProfile = await store.get(
      TABLE,
      authModel({ username: data.username })
    );

    if (authProfile.length > 0) {
      const [userProfile] = await store.get(
        "user_profile",
        userProfileModel(
          {
            userProfileId: authProfile[0].user_profile_id,
          },
          "find"
        )
      );

      if (authProfile[0].verified === true) {
        return bcrypt
          .compare(data.password, authProfile[0].password)
          .then((res) => {
            const accessToken = auth.sign(authProfile[0]);
            let authResponse = {
              token: accessToken,
              username: authProfile[0].username,
              userProfile,
            };

            if (res === true) {
              return authResponse;
            } else {
              throw new Error("Invalid username or password!");
            }
          })
          .catch((err) => {
            throw new Error(err.message);
          });
      } else {
        throw error("Not authorized! Missing verification", 401);
      }
    } else {
      throw new Error("Invalid username or password!");
    }
  }

  async function signout() {
    return {
      token: "",
    };
  }

  async function verify(params) {
    const authProfile = await store.get(
      TABLE,
      authModel({ username: params.username })
    );

    console.log(authProfile);

    if (authProfile.length > 0) {
      if (authProfile[0].verification_token === params.verificationToken) {
        await store.update(
          TABLE,
          authProfile[0].auth_id,
          authModel({
            verified: true,
          })
        );

        return;
      } else {
        throw error("Bad verification token", 400);
      }
    }
  }

  // if ()

  return {
    signup,
    signin,
    signout,
    verify,
  };
};
