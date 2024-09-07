const express = require("express");
const { NodeSSH } = require("node-ssh");
require("dotenv").config();

const app = express();
ssh = new NodeSSH();
const port = process.env.port;

const cors = require("cors");

app.use(
  cors({
    // <dev>
    origin: ["http://localhost:3000"],
    // <Release> origin: ["http://lastbeatlab.com:8300"],
  })
);

app.get("/api", function (req, res) {
  res.send("<h1>Remote Control App BE Area</h1>");
});

app.get("/api/control", (req, res) => {
  ssh
    .connect({
      host: process.env.SSH_host,
      username: process.env.SSH_user,
      port: process.env.SSH_port,
      password: process.env.SSH_password,
    })
    .then(() => {
      ssh
        .execCommand("shutdown -r -t 3", {})
        .then((result) => {
          // for Test Code : console.log("제어 성공!");
          res.send({ message: "success" });
        })
        .catch(() => {
          // for Test Code : console.error("제어 실패!");
          res.send({ message: "fail" });
        });
    })
    .then(() => {
      process.on("uncaughtException", function (err) {});
    });
});

app.listen(port, function () {
  console.log("Listen..");
});
