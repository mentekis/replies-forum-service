import { IRepliesDTO } from "../dto/replies.dto";
import { RepliesModel } from "./models"

export const repository = {
    getAll: async () => {
        const result = await RepliesModel.find().populate("user");

        return result;
    },

    findById: async (id: string) => {
        return await RepliesModel.findById(id).populate("user");
    },

    findByThreadId: async (threadId: string) => {
        return await RepliesModel.find({ threadId }).populate("user");
    },

    create: async (data: IRepliesDTO) => {
        const notification = new RepliesModel(data);

        return (await notification.save()).populate("user");
    },

    update: async (id: string, data: IRepliesDTO) => {
        return await RepliesModel.findByIdAndUpdate(id, data);
    },
}