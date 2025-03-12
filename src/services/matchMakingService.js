const axiosInstance = require("../config/axiosInstance");
const logger = require("../config/logger");

async function getMatchedUser(userId, lat, lon, matchRadius) {
  try {
    const url = `${process.env.MATCHMAKING_URL}/apis/v1/findMatch`;

    const requestData = { userId, lat, lon, matchRadius };

    const response = await axiosInstance.get(url, {
      headers: { "Content-Type": "application/json" },
      data: requestData, 
    });

    if (!response?.data?.matchedUserId) {
        if(response?.data?.message){
            throw new Error(response.data.message);
        }
      throw new Error("No match found");
    }

    logger.info(`Matchmaking successful for user ${userId}, Matched User ID: ${response.data.matchedUserId}`);
    return response.data.matchedUserId;
  } catch (error) {
    logger.error("Matchmaking API Call Failed", { error: error });

    if (error) {
      throw new Error(`Matchmaking API: ${error}`);
    } else {
      throw new Error("Matchmaking Service Unavailable");
    }
  }
}

module.exports = { getMatchedUser };
