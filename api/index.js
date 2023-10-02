const express = require("express");
const config = require("../config");
const bodyParser = require("body-parser");
const cors = require("cors");

//Microservices components
const auth = require("./components/auth/network");
const user = require("./components/user/network");
const customerType = require("./components/customerType/network");
const customer = require("./components/customer/network");
const fileType = require("./components/fileType/network");
const recordFile = require("./components/recordFile/network");
const record = require("./components/record/network");
const errors = require("../network/errors");

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

//Router
app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/customer-type", customerType);
app.use("/api/customer", customer);
app.use("/api/file-type", fileType);
app.use("/api/record-file", recordFile);
app.use("/api/record", record);

app.use(errors);

app.listen(config.app.port, () => {
  console.log("Server listening on port " + config.app.port);
});
