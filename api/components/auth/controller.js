const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const verificationTemplate = require("../../../template/email/verification");
const bcrypt = require("bcryptjs");
const error = require("../../../utils/error");
const db = require("../../../store/models/index");
const config = require("../../../config");

//Sequelize Models
const Auth = db.auth;
const UserProfile = db.userProfile;

const authMiddleware = require("../../../auth");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "grupoavant.tablet@gmail.com",
    pass: "mftyrvghgoreuzfp",
  },
});

async function signup(data) {
  return Auth.findAll({
    where: {
      username: data.username,
    },
  }).then((authExists) => {
    if (authExists.length > 0) {
      throw error("User already exists", 401);
    }

    const verificationToken = uuidv4();

    return UserProfile.create({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phoneNumber,
      status_type: "CREATED",
      created_by: data.createdBy,
      last_modified_by: data.lastModifiedBy,
    }).then((userProfile) => {
      console.log(userProfile);
      return Auth.create({
        username: data.username,
        password: bcrypt.hashSync(data.password, 8),
        user_profile_id: userProfile.dataValues.user_profile_id,
        verified: false,
        verification_token: verificationToken,
      }).then((auth) => {
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
          to: config.app.verficationEmails,
          subject: "Confirmación de Creación de Cuenta GaRecordfy",
          html: verificationTemplate({ ...data, queryParams }),
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            throw new Error(error);
          } else {
            console.log(info);
          }
        });

        return userProfile.dataValues;
      });
    });
  });
}

async function signin(data) {
  return Auth.findOne({
    where: {
      username: data.username,
    },
  })
    .then((auth) => {
      if (auth) {
        if (auth.dataValues.verified === true) {
          return UserProfile.findOne({
            where: {
              user_profile_id: auth.dataValues.user_profile_id,
            },
          }).then((user) => {
            return bcrypt
              .compare(data.password, auth.dataValues.password)
              .then((res) => {
                const accessToken = authMiddleware.sign(auth.dataValues);
                let authResponse = {
                  token: accessToken,
                  username: auth.dataValues.username,
                  userProfile: user.dataValues,
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
          });
        } else {
          throw error("Not authorized! Missing verification", 401);
        }
      } else {
        throw error("Invalid username or password!");
      }
    })
    .catch((err) => {
      throw error(err.message);
    });
}

async function signout() {
  return {
    token: "",
  };
}

async function verify(params) {
  return Auth.findAll({
    where: {
      username: params.username,
    },
  })
    .then((auth) => {
      if (auth.length > 0) {
        if (
          auth[0].dataValues.verification_token === params.verificationToken
        ) {
          return Auth.update(
            {
              verified: true,
            },
            { where: { username: params.username } }
          ).then(() => {
            console.log("NO PUEDE SER ", auth);
            return;
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      throw error(err.message);
    });
}

module.exports = {
  signup,
  signin,
  signout,
  verify,
};
