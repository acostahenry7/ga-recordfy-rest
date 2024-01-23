const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../../auth");
const response = require("../../../network/response");
const controller = require("./index");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination(req, res, cb) {
    console.log("NO PUEDE SER ###############################", req.body);
    const route = path.join(
      __dirname,
      `../../../data/${req.body.beneficiaryId}`
    );
    fs.mkdirSync(route, { recursive: true });
    cb(null, route);
  },
  filename(req, file, cb) {
    let fName = req.body.name.substring(0, req.body.name.lastIndexOf("."));

    let fileExtension = file.originalname.substring(
      file.originalname.lastIndexOf(".") + 1
    );

    const filename = `${fName}.${fileExtension}`;

    req.body = {
      ...req.body,
      fileLocation: `http://${req.hostname}:${req.socket.localPort}/static/${req.body.beneficiaryId}/${filename}`,
    };

    cb(null, filename);
  },
});

let upload = multer({ storage });

// router.post("/update", upload.single("file"), update);
router.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.body);

  controller
    .insert(req.body)
    .then((msg) => {
      response.success(req, res, msg, 200);
    })
    .catch((err) => {
      response.error(req, res, err.message, err.statusCode);
    });
});

router.get("/", verifyToken, (req, res) => {
  if (Object.entries(req.query).length > 0) {
    controller
      .get(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, err.statusCode);
      });
  } else {
    controller
      .list()
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, err.statusCode);
      });
  }
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

router.delete("/", (req, res) => {
  let location = req.query.fileLocation;

  let dirName = location.slice(
    location.lastIndexOf("/") - 36,
    location.lastIndexOf("/")
  );
  let fileName = location.slice(location.lastIndexOf("/") + 1, location.length);

  console.log(dirName);
  fs.unlink(
    path.join(__dirname, `../../../data/${dirName}/${fileName}`),
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("borrado");
      }
    }
  );

  console.log(req.query.recordFileId);

  controller
    .remove(req.query.recordFileId)
    .then((msg) => {
      response.success(req, res, msg, 200);
    })
    .catch((err) => {
      response.error(req, res, err.message, err.statusCode);
    });
});

module.exports = router;
