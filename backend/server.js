const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5555;
const server = express();
const routes = require("./routes/routes");
const cookieParser = require("cookie-parser");

server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
server.use(cookieParser());
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
