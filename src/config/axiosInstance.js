const axios = require("axios");

const axiosInstance = axios.create({
  timeout: 5000, // 5 seconds timeout
  headers: { "Content-Type": "application/json" },
});

module.exports = axiosInstance;
