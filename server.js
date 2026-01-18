const express = require("express");
const session = require("express-session/");
const passport = require("passport");
const port = process.env.PORT || 5555;
const server = express();
const routes = require("./routes/routes");

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use("/", routes);

server.listen(port, (error) => {
  if (!error) {
    console.log("active");
  } else {
    console.log(`whomp :( @ ${error.message}`);
  }
});
