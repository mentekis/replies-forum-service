import { IRepliesRequest, IRepliesDTO, IRepliesResponse } from "../dto/replies.dto";
import { RepliesRepo } from "../repositories";
import { IUser } from "../dto/user.dto";
import { userService } from "./user.service";
import { z } from "zod";
import { rabbitmq } from "../utils";

// Thread validation
const repliesValidationSchema = z.object({
    threadId: z.string({ message: "Thread ID must exists" }),
    userId: z.string({ message: "User ID not found" }),
    body: z.string({ message: "Reply body is required" }).min(2, { message: "Minimum thread is 8 character" }),
})

export const service = {
    list: async (threadId: string) => {
        const result = await RepliesRepo.findByThreadId(threadId);

        return result;
    },

    create: async (requestData: IRepliesRequest, user: IUser) => {
        // Validate request data
        const validated = repliesValidationSchema.safeParse(requestData);

        if (!validated.success) {
            throw new Error(validated.error.errors.at(0)?.message);
        }

        // Find user by ID
        // Create user if not exists
        // Use user service
        // Communicate with other data using servicem not repository
        let currentUser = await userService.findById(requestData.userId);

        if (!currentUser) {
            currentUser = await userService.create(requestData.userId, user.name);
        }

        // Construct data to store in DB
        const data: IRepliesDTO = {
            user: currentUser._id,
            threadId: requestData.threadId,
            body: requestData.body,
        }

        // Store to database
        const result = await RepliesRepo.create(data);

        // Emit event new reply created, send notification to thrad owner
        const emittedData = {
            threadId: requestData.threadId,
            userId: user._id,
            timestamp: Math.floor(Date.now() / 1000),
        };

        await rabbitmq.emitEventTo("newReply", emittedData);

        return result;
    },

    update: async (requestData: IRepliesRequest, id: string, user: IUser) => {
        // Validate request data
        const validated = repliesValidationSchema.safeParse(requestData);

        if (!validated.success) {
            throw new Error(validated.error.errors.at(0)?.message);
        }

        // Construt data for storing in DB
        // User can only update body
        const data: IRepliesDTO = {
            body: requestData.body,
        }

        return await RepliesRepo.update(id, data);
    },

    mapSingleReplyResponse: (replies: any): IRepliesResponse => {
        return mapSingleReply(replies);
    },

    mapRepliesResponse: (replies: any[]): IRepliesResponse[] => {
        return replies.map((reply) => mapSingleReply(reply));
    }
}

const mapSingleReply = (reply: any): IRepliesResponse => {
    return {
        _id: reply._id,
        threadId: reply.threadId,
        body: reply.body,
        user: userService.mapUserResponse(reply.user),
    }
}