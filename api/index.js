const express = require("express");
const config = require("../config");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const db = require("../store/models");
const { expiringDocsCron, expiredDocsCron } = require("../crontabs/reports");
//const { db } = require("../store/postgres");

//Microservices components
const auth = require("./components/auth/network");
//const user = require("./components/user/network");
const customer = require("./components/customer/network");
// const customerType = require("./components/customerType/network");
const beneficiaryTypeFile = require("./components/beneficiaryTypeFile/network");
const fileType = require("./components/fileType/network");
const recordFile = require("./components/recordFile/network");
const record = require("./components/record/network");
const errors = require("../network/errors");

const app = express();

const { WebSocketServer } = require("ws");
const { generateReport } = require("../reports");
const sockserver = new WebSocketServer({ port: config.app.wsport });
process.env.TZ = "America/Santo_Domingo";

sockserver.on("connection", (ws) => {
  console.log("New client connected!");
  //0 9 */1 * *
  let productionCron = "30 8,13,16 * * 0-6";
  let devCron = "*/60 * * * * *";
  cron.schedule(productionCron, async () => {
    const [notifications] = await db.sequelize.query(`
    select rf.record_file_id, rf.name, ft.name as file_type, rf.expiration_date,
    r.record_id, c.customer_name
    from record_file rf
    join file_type ft on (rf.file_type_id = ft.file_type_id)
    join beneficiary b on (rf.beneficiary_id = b.beneficiary_id)
	  join record r on (b.record_id = r.record_id)
    join customer c on (r.customer_id = c.customer_id)
    WHERE expiration_date::date <= CURRENT_DATE
    AND rf.status_type <> 'DELETED'`);
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
app.use("/api/auth", auth);
// app.use("/api/user", user);
app.use("/api/customer", customer);
// app.use("/api/customer-type", customerType);
app.use("/api/beneficiary-type-file", beneficiaryTypeFile);
app.use("/api/file-type", fileType);
app.use("/api/record-file", recordFile);
app.use("/api/record", record);

//Static Content
app.use("/static", express.static(path.join(__dirname, "../data")));

app.use(errors);

app.listen(config.app.port, () => {
  console.log("Server listening on port " + config.app.port);
});

db.sequelize.sync();

//Crontabs for reports
expiringDocsCron();
expiredDocsCron();

// generateReport();
