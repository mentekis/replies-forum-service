import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

interface ITokenData {
    name: string;
    _id: string
}

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
    // Get access token from cookies
    const { accessToken } = req.cookies;

    // Decode and store it on locals
    const tokenData = jwt.decode(accessToken) as ITokenData;

    // Sign to locals,
    // So the next handler can use the data
    res.locals.user = tokenData;

    next();
}