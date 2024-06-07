const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/userRoute");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connection } = require("./server/server");
require("dotenv").config();

const app = express();
const PORT = process.env.DB_PORT || 4060;

app.use(bodyParser.json());
app.use(cors());

app.use(cookieParser());
app.use("/", router);

const syncDB = async () => {
  try {
    await connection.authenticate();
    console.log("Database is connected and tables are synced");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

const server = async () => {
  await syncDB();
  app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
  });
};

server();