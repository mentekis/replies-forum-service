import { Types } from "mongoose";
import { IUser } from "./user.dto";

/**
 * Base Structure for reply
 */
interface IBaseReplies {
    body: string;
    threadId?: string;
}

/**
 * Structure for reply request.
 * COmmonly used for create and store.
 */
export interface IRepliesRequest extends IBaseReplies {
    userId: string;
}

/**
 * DTO to store reply in database
 */
export interface IRepliesDTO extends IBaseReplies {
    user?: string | null;
}

/**
 * Reply response structure
 */
export interface IRepliesResponse extends IBaseReplies {
    _id: Types.ObjectId;
    user: IUser;
}