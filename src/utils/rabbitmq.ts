import amqplib from 'amqplib'
import { env } from './env'

type TQueueList =
    "newReply" |
    "enrichUserThreadData" |
    "updateUserData";

let connection: amqplib.Connection | null = null;

export async function newConnection() {
    try {
        // Create new connection
        const conn = await amqplib.connect(env.RABBITMQ_URI);

        return conn;

    } catch (error) {
        console.log("Error connect to message broker : ", error);

        throw error;
    }
}

export async function listenTo(queue: TQueueList, duty: (msg: amqplib.Message) => void | Promise<any>) {
    try {
        // Create new channel fro connection
        // Create new connection if caller use null connection
        if (connection == null) {
            connection = await newConnection();
        }

        const chan = await connection.createChannel();
        chan.assertQueue(queue)

        chan.consume(queue, async (msg) => {
            if (msg !== null) {
                console.log(`message received : `, msg.content.toString())

                // Perform the duty by generalize all function are async
                // Use try catch block to catch any error happen
                try {
                    const result = duty(msg);

                    // Check if result is returning Promise
                    // If it is a promise, then we await the actual result
                    if (result instanceof Promise) {
                        await result;
                    }
                } catch (error) {
                    console.log(`Error in performing duty : ${error}`)
                }

                chan.ack(msg);
            } else {
                console.log("Consumer cancelled by server");
            }
        })
    } catch (error) {
        console.log(`Error consuming channel : ${queue} : `, error)
    }
}

export async function emitEventTo(queue: TQueueList, data: string | object) {
    try {
        // Create connection if no connection provided
        if (connection == null) {
            connection = await newConnection();
        }

        // Create sender channel
        const sendChan = await connection.createChannel();

        sendChan.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.log(`Emit process ${queue} failed`, error)
    }
}
