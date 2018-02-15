const express = require("express");
const path = require("path");
const app = express();

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Server listening on port:" + port);
});

app.use("/static", express.static('build/static'));

app.get("/favicon.ico", function (req, res) {
  res.sendFile(path.join(__dirname, "./build/favicon.ico"));
});

app.get("*", function (request, result) {
  result.sendFile(__dirname + "/build/index.html");
});
