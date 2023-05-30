const express = require("express");
const { connection } = require("./config/db");
const cors = require("cors");
const { UserRouter } = require("./routes/users.routes");
const { FlightRouter } = require("./routes/flights.routes");
const { BookingRouter } = require("./routes/booking.routes");
const { authentication } = require("./middlewares/authentication");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(UserRouter);
app.use(authentication);
app.use(FlightRouter);
app.use(BookingRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("DB connected and server started");
  } catch (error) {
    console.log(error);
  }
});
