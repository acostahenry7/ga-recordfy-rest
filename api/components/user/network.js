const express = require("express");
const router = express.Router();
const secure = require("./secure");
const response = require("../../../network/response");
const controller = require("./index");

router.get("/", secure.canList, (req, res) => {
  console.log("USER NETWORK GET ", req.query);
  if (Object.keys(req.query).length > 0) {
    controller
      .get(req.query)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch((error) => {
        response.error(req, res, error.message, 500);
      });
  } else {
    controller
      .list()
      .then((list) => {
        response.success(req, res, list, 200);
      })
      .catch((error) => {
        response.error(req, res, error.message, 200);
      });
  }
});

router.post("/", (req, res) => {
  controller
    .insert(req.body)
    .then((user) => {
      response.success(req, res, user, 200);
    })
    .catch((error) => {
      response.error(req, res, error.message, 500);
    });
});

// router.patch()

module.exports = router;
