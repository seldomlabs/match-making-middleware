const producer = require("./config/kafka");
const { getMatchedUser } = require("./services/matchMakingService");
const { getUserData } = require("./services/userService");
const logger = require("./config/logger");

async function matchUser(userId, lat, lon, matchRadius) {
  try {
    if (!userId || !lat || !lon || !matchRadius) {
      throw new Error("Missing required parameters: userId, lat, lon, matchRadius");
    }

    await producer.send({
      topic: process.env.KAFKA_TOPIC,
      messages: [{ key: String(userId), value: JSON.stringify({ userId, lat, lon, matchRadius }) }],
    });

    logger.info(`Message pushed to Kafka for user ${userId}`);

    const matchedUserId = await getMatchedUser(userId, lat, lon, matchRadius);

    const matchedUserData = await getUserData(matchedUserId);

    return { matchedUserId, user: matchedUserData };
  } catch (error) {
    logger.error("Error in matchmaking flow", { error: error.message });
    throw error;
  }
}

module.exports = { matchUser };
