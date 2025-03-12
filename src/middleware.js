const producer = require("./config/kafka");
const { getMatchedUser } = require("./services/matchMakingService");
const { getUserData } = require("./services/userService");
const logger = require("./config/logger");
const { pushToKafka } = require("./services/kafkaProducer");

async function matchUser(userId, lat, lon, matchRadius) {
  try {
    if (!userId || !lat || !lon || !matchRadius) {
      throw new Error("Missing required parameters: userId, lat, lon, matchRadius");
    }
    const ADD = "add"
    await pushToKafka(userId, lat, lon, ADD);

    logger.info(`Message pushed to Kafka for user ${userId}`);

    const matchServiceData = await getMatchedUser(userId, lat, lon, matchRadius);

    const matchedUserData = await getUserData(matchServiceData?.matchedUserId);

    return { data: matchServiceData, matchedUser: matchedUserData };
  } catch (error) {
    logger.error("Error in matchmaking flow", { error: error.message });
    throw error;
  }
}

module.exports = { matchUser };
