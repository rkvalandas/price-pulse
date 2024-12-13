const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const { connectMongoDb } = require("./config/connectdb");
const cors = require("cors");

const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const alertRoute = require("./routes/alert");
const priceTrackerRoute = require("./routes/tracker");

const app = express();
const PORT = process.env.PORT || 8000;

dotenv.config();


connectMongoDb(process.env.MONGO_URI)
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => console.log("error:", err));

const corsConfig = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  method: ["GET", "POST", "PUT", "DELETE"],
};

app.options("", cors(corsConfig));
app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

// API routes
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/alerts", alertRoute);
app.use("/api/pricetracker", priceTrackerRoute);

app.listen(PORT, () => {
  console.log(`Listening at port: ${PORT}`);
});
