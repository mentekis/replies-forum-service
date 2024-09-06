import { Request, Response } from "express";
import { responseGenerator } from "../utils";
import { RepliesService } from "../services";

const controller = {
    list: async (req: Request, res: Response) => {
        try {
            // Get Thread id from parameters

            const result = await RepliesService.list(req.params.threadId);

            const response = RepliesService.mapRepliesResponse(result);

            return responseGenerator.generatedResponse(res, { data: response });
        } catch (error) {
            const issue = (error as Error).message;

            return responseGenerator.generatedResponse(res, { status: 400, message: issue });
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            // Get data from request
            const { threadId, body } = req.body;

            // Get user ID from locals
            const user = res.locals.user;

            const result = await RepliesService.create({
                threadId,
                body,
                userId: user._id
            }, user);

            const response = RepliesService.mapSingleReplyResponse(result);

            return responseGenerator.generatedResponse(res, { data: response });
        } catch (error) {
            const issue = (error as Error).message;

            return responseGenerator.generatedResponse(res, { status: 400, message: issue });
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            // Get data from request
            const { threadId, body } = req.body;

            // ID from params
            const { id } = req.params;

            // Get user ID from locals
            const user = res.locals.user;

            const result = await RepliesService.update({
                threadId,
                body,
                userId: user._id
            }, id, user);
        } catch (error) {
            const issue = (error as Error).message;

            return responseGenerator.generatedResponse(res, { status: 400, message: issue });
        }
    }

}

export { controller };