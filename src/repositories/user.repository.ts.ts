import { IUser } from "../dto/user.dto";
import { userModel } from "./models";

export const repository = {

    findById: async (id: string) => {
        return await userModel.findById(id);
    },

    create: async (data: IUser) => {
        const user = new userModel(data);

        return await user.save();
    },

    update: async (id: string, data: IUser) => {
        return await userModel.findByIdAndUpdate(id, data);
    },
}