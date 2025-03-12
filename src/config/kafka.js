require("dotenv").config();
const { Kafka } = require("kafkajs");
const logger = require("./logger");

const kafka = new Kafka({
  clientId: "matchmaking-middleware",
  brokers: [process.env.KAFKA_BROKER], 
});

const producer = kafka.producer();

(async () => {
  try {
    await producer.connect();
    logger.info("Kafka Producer Connected Successfully");
  } catch (error) {
    logger.error("Kafka Producer Connection Failed", { error: error.message });
  }
})();

module.exports = producer;
