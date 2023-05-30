const express = require("express");
require("dotenv").config();
const { FlightModel } = require("../models/flight.model");

const FlightRouter = express.Router();

FlightRouter.get("/api/flights", async (req, res) => {
  try {
    const allFlights = await FlightModel.find();
    res.status(200).json({ flights: allFlights });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

FlightRouter.get("/api/flights/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const singleFlight = await FlightModel.findOne({ _id: id });
    res.status(200).json({ flights: singleFlight });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

FlightRouter.post("/api/flights", async (req, res) => {
  try {
    const {
      airline,
      flightNo,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      seats,
      price,
    } = req.body;

    const flight = await FlightModel.findOne({
      airline,
      flightNo,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      seats,
      price,
    });

    if (flight) {
      return res.status(400).json({ message: "Flight already exists" });
    }

    const newFlight = await FlightModel({
      airline,
      flightNo,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      seats,
      price,
    });
    await newFlight.save();

    res.status(201).json({ message: "Flight added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

FlightRouter.patch("/api/flights/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;

    await FlightModel.findByIdAndUpdate({ _id: id }, payload, {
      new: true,
    });

    res.status(204).json({ message: "Flight updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

FlightRouter.delete("/api/flights/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await FlightModel.findByIdAndDelete({ _id: id });

    res.status(202).json({ message: "Flight deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { FlightRouter };
