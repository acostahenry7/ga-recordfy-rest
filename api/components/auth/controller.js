const nodemailer = require("nodemailer");
const TABLE = "auth";
const { v4: uuidv4 } = require("uuid");
const verification = require("../../../template/email/verification");
const { authModel } = require("../../../store/models/auth");
const { userProfileModel } = require("../../../store/models/user");
const bcrypt = require("bcryptjs");

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
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return new Promise((resolve) => {
        resolve("Email sent");
      });
      // return store.get("user_profile", {
      //   user_profile_id: userProfile.user_profile_id,
      // });
    }
  }

  async function signin(data) {
    const authProfile = await store.get(
      TABLE,
      authModel({ username: data.username })
    );

    const [userProfile] = await store.get(
      "user_profile",
      userProfileModel(
        {
          userProfileId: authProfile[0].user_profile_id,
        },
        "find"
      )
    );

    if (authProfile.length > 0) {
      return new Promise((resolve, reject) => {
        if (authProfile[0].verified === true) {
          bcrypt
            .compare(data.password, authProfile[0].password)
            .then((res) => {
              let authResponse = {
                username: authProfile[0].username,
                userProfile,
              };

              if (res === true) {
                resolve(authResponse);
              } else {
                reject(new Error("Invalid username or password!"));
              }
            })
            .catch((err) => {
              reject(new Error(err.message));
            });
        } else {
          reject(new Error("Not verified!"));
        }
      });
    } else {
      console.log("errro");
      return new Promise((resolve, reject) => {
        reject(new Error("Invalid username or password!"));
      });
    }
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
          authModel({
            authId: authProfile[0].auth_id,
            verified: true,
          })
        );

        return new Promise((resolve, reject) => {
          resolve();
        });
      } else {
        return new Promise((resolve, reject) => {
          reject();
        });
      }
    }
  }

  // if ()

  return {
    signup,
    signin,
    verify,
  };
};
