import { response, Response } from "express";

interface responseOption<T> {
    status?: number;
    message?: string;
    data?: T;
    cookies?: [string, string][];
}

interface responseStructure {
    success: boolean;
    message: string;
    data: any
}

export function generatedResponse<T>(res: Response, options?: responseOption<T>) {
    // default status is 200
    const status: number = options?.status || 200;

    // default message is OK
    const message: string = options?.message || "OK";

    // default data is null
    const data: T | null = options?.data || null;

    // Construct final response structure
    const response: responseStructure = {
        success: (status >= 200 && status < 300),
        message,
        data,
    };

    // Set cookie if exists
    (options?.cookies || []).map((cookie) => {
        const [key, value] = cookie;

        res.cookie(key, value);
    });

    return res.status(status).json(response);
}