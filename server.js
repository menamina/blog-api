const express = require("express");
const port = process.env.PORT || 5555;
const server = express();
const routes = require("./backend/routes/routes");
const cors = require("cors");

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use("/uploads", express.static("uploads"));
server.use(cors());

server.use("/", routes);

server.listen(port, (error) => {
  if (!error) {
    console.log("active");
  } else {
    console.log(`whomp :( @ ${error.message}`);
  }
});
