const express = require("express");
const session = require("express-session/");
const passport = require("passport");
const port = process.env.PORT || 5000;
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.listen(port, (error) => {
  if (!error) {
    console.log("active");
  } else {
    console.log("whomp :(");
  }
});
