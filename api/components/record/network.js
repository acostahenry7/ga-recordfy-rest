const express = require("express");
const router = express.Router();
const response = require("../../../network/response");
const controller = require("./index");

router.get("/", (req, res) => {
  res.send("RECORDS LIST");
});
