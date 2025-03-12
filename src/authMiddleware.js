const axiosInstance = require("./config/axiosInstance");
const logger = require("./config/logger");

async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Missing or invalid Authorization header");
    }

    const token = authHeader.split(" ")[1]; 

    const url = `${process.env.USER_SERVICE_URL}/users/me`;
    const response = await axiosInstance.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data || !response.data.user ||  !response.data.user.sub) {
      throw new Error("Invalid authentication response");
    }

    req.userId = response.data.user.sub;
    logger.info(`Authenticated User ID: ${req.userId}`);
    
    next(); 
  } catch (error) {
    logger.error("Authentication Failed", { error: error.message });
    return res.status(401).json({ error: "Unauthenticated" });
  }
}

module.exports = authenticateUser;
