import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from 'express';
import type { UserDocument } from "../models/user";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
        return res.status(401).json({ error: "Access Denied! No Access token found!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserDocument;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "In-Valid token found!" });
    }
}