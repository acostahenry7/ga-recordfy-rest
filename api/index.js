const express = require("express");
const config = require("../config");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const { db } = require("../store/postgres");

//Microservices components
const auth = require("./components/auth/network");
const user = require("./components/user/network");
const customerType = require("./components/customerType/network");
const customerFileType = require("./components/customerFileType/network");
const customer = require("./components/customer/network");
const fileType = require("./components/fileType/network");
const recordFile = require("./components/recordFile/network");
const record = require("./components/record/network");
const errors = require("../network/errors");

const app = express();

const { WebSocketServer } = require("ws");
const sockserver = new WebSocketServer({ port: 3002 });

sockserver.on("connection", (ws) => {
  console.log("New client connected!");
  console.log(new Date().toLocaleString("es-ES", { timeZone: "UTC" }));
  //0 9 */1 * *
  let productionCron = "0 9 * * 1-6";
  let devCron = "*/15 * * * * *";
  cron.schedule(devCron, async () => {
    const [notifications] = await db.query(`
    select rf.record_file_id, rf.name, ft.name as file_type, rf.expiration_date,
    r.record_code, c.customer_name
    from record_file rf
    join file_type ft on (rf.file_type_id = ft.file_type_id)
    join record r on (rf.record_id = r.record_id)
    join customer c on (r.customer_id = c.customer_id)
    WHERE expiration_date::date = CURRENT_DATE`);
    console.log(notifications);
    ws.send(JSON.stringify(notifications));
  });

  ws.on("close", () => console.log("Client has disconnected!"));
  // ws.on("message", (data) => {
  //   sockserver.clients.forEach((client) => {
  //     // console.log(`distributing message: ${data}`);
  //     client.send(`${data}`);
  //   });
  // });
});

//Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

//Router

app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/customer", customer);
app.use("/api/customer-type", customerType);
app.use("/api/customer-file-type", customerFileType);
app.use("/api/file-type", fileType);
app.use("/api/record-file", recordFile);
app.use("/api/record", record);

//Static Content
app.use("/static", express.static(path.join(__dirname, "../data")));

app.use(errors);

app.listen(config.app.port, () => {
  console.log("Server listening on port " + config.app.port);
});
