import express from 'express';
import { env, mongoose } from './utils';
import originChecker from './middleware/gateway-origin-checker.middleware';
import { newRouter } from './transport/http';
import { startListenMessage } from './transport/rabbitmq';
import cookieParser from 'cookie-parser';

// Connect to Mongo
mongoose.mongoConnect();

// Listen to rabbit mq handler
startListenMessage()
    .then(() => console.log("Listening to message broker"))
    .catch((e) => console.log(e));

// === Express Block ===
const PORT = env.env.SERVICE_PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(originChecker);

newRouter(app);

app.listen(PORT, () => console.log(`Service started on Port ${PORT}`));