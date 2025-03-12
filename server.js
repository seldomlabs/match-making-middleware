require("dotenv").config();
const express = require("express");
const { matchUser } = require("./src/middleware");
const errorHandler = require("./src/utils/errorHandler");
const authenticateUser = require("./src/authMiddleware");

const app = express();
app.use(express.json());

app.post("/matchmaking", authenticateUser, async (req, res, next) => {
  try {
    const { lat, lon, matchRadius } = req.body;
    const userId = req.userId; 
    const result = await matchUser(userId, lat, lon, matchRadius);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
