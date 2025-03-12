const axiosInstance = require("../config/axiosInstance");
const logger = require("../config/logger");

async function getUserData(userId) {
  try {
    const url = `${process.env.USER_SERVICE_URL}/users`;

    const params = {
      ids: JSON.stringify([userId]), // Correctly formatting the query parameter
    };

    const response = await axiosInstance.get(url, { params });

    if (!response.data || !response.data?.userDetails) {
      throw new Error("User not found");
    }

    logger.info(`User data fetched successfully for ID: ${userId}`);
    return Object.values(response.data.userDetails); 
  } catch (error) {
    logger.error(`Failed to fetch user data for ID: ${userId}`, { error: error.message });

    if (error.response) {
      throw new Error(`User Service API Error: ${error.response.data}`);
    } else {
      throw new Error("User Service Unavailable");
    }
  }
}

module.exports = { getUserData };
