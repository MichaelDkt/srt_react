const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Server listening on port:" + port);
});

app.use("/static", express.static('build/static'));

app.get("*", function (request, result) {
  result.sendFile(__dirname + "/build/index.html");
});
