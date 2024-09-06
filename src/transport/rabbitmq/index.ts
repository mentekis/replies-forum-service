import { IUser } from "../../dto/user.dto";
import { userService } from "../../services";
import { rabbitmq } from "../../utils";


// Create new connection
// Start to listening channel
export async function startListenMessage() {
    try {
        const conn = await rabbitmq.newConnection();

        // Listen to channel
        await rabbitmq.listenTo(conn, "enrichUserThreadData", (msg) => { console.log(msg.content.toString()) })

        await rabbitmq.listenTo(conn, "updateUserData", (msg) => {
            // Decode the data from message to object
            const user: IUser = JSON.parse(msg.content.toString());

            // Update data using user service
            userService.update(user?._id, user?.name);
        });

    } catch (error) {
        throw error;
    }
}