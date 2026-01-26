const express = require("express");
const port = process.env.PORT || 5555;
const server = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: "http://localhost:5173",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

server.use(cors(corsOptions));

const routes = require("./backend/routes/routes");

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use("/uploads", express.static("uploads"));

server.use("/", routes);

server.listen(port, (error) => {
  if (!error) {
    console.log("active");
  } else {
    console.log(`whomp :( @ ${error.message}`);
  }
});
