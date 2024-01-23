const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../../auth");
const response = require("../../../network/response");
const controller = require("./index");

router.get("/", verifyToken, (req, res) => {
  controller
    .get(req.query)
    .then((msg) => {
      response.success(req, res, msg, 200);
    })
    .catch((err) => {
      response.error(req, res, err.message, err.statusCode);
    });
});

router.post("/", verifyToken, (req, res) => {
  controller
    .insert(req.body)
    .then((msg) => {
      response.success(req, res, msg, 200);
    })
    .catch((err) => {
      response.error(req, res, err.message, err.statusCode);
    });
});

router.put("/:id", verifyToken, (req, res) => {
  controller
    .update(req.params.id, req.body)
    .then((msg) => {
      response.success(req, res, msg, 200);
    })
    .catch((err) => {
      response.error(req, res, err.message, err.statusCode);
    });
});

module.exports = router;
