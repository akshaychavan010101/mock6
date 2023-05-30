const express = require("express");
require("dotenv").config();
const { BookingModel } = require("../models/booking.model");

const BookingRouter = express.Router();

BookingRouter.post("/api/booking", async (req, res) => {
  try {
    const {flight } = req.body;

    const booking = await BookingModel.findOne({ user : req.userId, flight });

    if (booking) {
      return res.status(400).json({ message: "Booking already exists" });
    }

    const newBooking = await BookingModel({ user : req.userId, flight });
    await newBooking.save();

    res.status(201).json({ message: "Booking successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

BookingRouter.get("/api/dashboard", async (req, res) => {
  try {
    const allBookings = await BookingModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "users",
        },
      },

      {
        $lookup: {
          from: "flights",
          localField: "flight",
          foreignField: "_id",
          as: "flights",
        },
      },
    ]);

    res.status(200).json({ bookings: allBookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { BookingRouter };
