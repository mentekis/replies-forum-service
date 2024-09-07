import { IUser } from "../../dto/user.dto";
import { userService } from "../../services";
import { rabbitmq } from "../../utils";
import amqplib from 'amqplib'


// Create new connection
// Start to listening channel
export async function startListenMessage() {
    try {
        // Listen to channel
        await rabbitmq.listenTo("updateUserData", (msg) => {
            // Decode the data from message to object
            const user: IUser = JSON.parse(msg.content.toString());

            // Update data using user service
            userService.update(user?._id, user?.name);
        });

    } catch (error) {
        throw error;
    }
}