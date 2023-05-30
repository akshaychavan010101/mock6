const jwt = require("jsonwebtoken");
const authentication = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(400).json({ message: "Please Login" });
    }
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
       return res.status(400).json({ message: "Invalid token" });
      }
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { authentication };
