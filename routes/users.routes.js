const express = require("express");
const { UserModel } = require("../models/users.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserRouter = express.Router();

UserRouter.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exists" });
    }

    const newUser = await UserModel({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

UserRouter.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res
        .status(201)
        .json({ message: "User logged in successfully", token });
    }

    res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {}
});

module.exports = { UserRouter };
