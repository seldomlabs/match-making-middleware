const producer  = require("../config/kafka");
const logger = require("../config/logger");

async function pushToKafka(userId, lat, lon, operation) {
  try {
    const topic = process.env.KAFKA_TOPIC;

    const message = {
      userId,
      lat,
      lon,
      operation, 
    };

    await producer.send({
      topic,
      messages: [{ key: String(userId), value: JSON.stringify(message) }],
    });

    logger.info(`Message pushed to Kafka topic ${topic}: ${JSON.stringify(message)}`);
  } catch (error) {
    logger.error("Failed to push message to Kafka", { error: error.message });
    throw new Error("Kafka push failed");
  }
}

module.exports = { pushToKafka };
