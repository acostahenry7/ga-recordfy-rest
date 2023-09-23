const express = require("express");
const config = require("../config");
const bodyParser = require("body-parser");

//Microservices components
const auth = require("./components/auth/network");
const user = require("./components/user/network");
const errors = require("../network/errors");

const app = express();

//Middleware
app.use(bodyParser.json());

//Router
app.use("/api/user", user);
app.use("/api/auth", auth);

app.use(errors);

app.listen(config.app.port, () => {
  console.log("Server listening on port " + config.app.port);
});
