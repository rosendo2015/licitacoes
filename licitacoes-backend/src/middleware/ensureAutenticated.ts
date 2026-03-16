import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../utils/AppError";

interface TokenPayload {
    sub: string;
    role: string;
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new AppError("JWT token is missing", 401);

    const [, token] = authHeader.split(" ");

    try {
        const decoded = verify(token, process.env.JWT_SECRET!) as TokenPayload;
        req.user = { id: decoded.sub, role: decoded.role };
        return next();
    } catch {
        throw new AppError("Invalid JWT token", 401);
    }
}