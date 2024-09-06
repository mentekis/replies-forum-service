import { NextFunction, Request, Response } from "express";
import { env, responseGenerator } from "../utils";

export default function originChecker(req: Request, res: Response, next: NextFunction) {
    // Check if the host is not from API Gateway
    // Throw error if client trying to access service directly
    const host = env.env.SERVICE_HOST;
    const port = env.env.SERVICE_PORT;

    const currentServiceAddr = `${host}:${port}`;

    if (req.headers.host == currentServiceAddr) {
        return responseGenerator.generatedResponse(res, {
            status: 403,
            message: "What are u doing here?!"
        });
    }

    next();
}