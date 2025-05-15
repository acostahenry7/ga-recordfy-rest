const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../../auth");
const { isOwner } = require("./secure");
const response = require("../../../network/response");
const controller = require("./index");

router.get("/", verifyToken, (req, res) => {
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

router.put("/:id", [verifyToken, isOwner], (req, res) => {
  controller
    .update(req.params.id, req.body)
    .then((msg) => {
      response.success(req, res, msg, 200);
    })
    .catch((err) => {
      response.error(req, res, err.message, err.statusCode);
    });
});

// router.patch()

module.exports = router;
