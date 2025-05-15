const express = require("express");
const router = express.Router();
const response = require("../../../network/response");
const controller = require("./index");
const { verifyToken } = require("../../../auth");

router.post("/signup", (req, res) => {
  controller
    .signup(req.body)
    .then((message) => {
      response.success(req, res, message, 200);
    })
    .catch((err) => {
      response.error(req, res, err.message, 500);
    });
});

router.post("/signin", (req, res) => {
  controller
    .signin(req.body)
    .then((message) => {
      response.success(req, res, message, 200);
    })
    .catch((err) => {
      response.error(req, res, err.message, err.statusCode);
    });
});

router.post(
  "/signout",
  /*verifyToken,*/ (req, res) => {
    controller
      .signout()
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, err.statusCode);
      });
  }
);

router.get("/verify", (req, res) => {
  controller
    .verify(req.query)
    .then((msg) => {
      // response.success(req, res, msg, 200);
      res.send(
        `<html><h1>Tu cuenta ha sido verificada exitosamente!</h1></html>`
      );
    })
    .catch((err) => {
      res.send(
        `<html><h1>Los sentimos, su cuenta no pudo ser validada!</h1></html>`
      );
    });
});

module.exports = router;
