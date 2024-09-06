import { cleanEnv, num, str } from "envalid";
import dotenv from 'dotenv';

// Call dotenv to extend system env
dotenv.config();

// ENV Validator structure
const envValidator = {
    SERVICE_PORT: num({ default: 8003 }),
    SERVICE_HOST: str({ desc: "Service host as address", default: "localhost" }),
    MONGO_URI: str({ desc: "Connection string for MongoDB" }),
    RABBITMQ_URI: str({ desc: "Connection string for Rabbit MQ", default: "amqp://localhost" }),
}

// Validate the environment variable
const env = cleanEnv(process.env, envValidator);

export {
    env
};