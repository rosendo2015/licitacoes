import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "../utils/AppError";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import z from "zod";

export class SessionsController {
    async create(req: Request, res: Response) {
        const schema = z.object({
            email: z.string().email(),
            password: z.string().min(6),
        });

        const { email, password } = schema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new AppError("Invalid email or password", 401);

        const validPassword = await compare(password, user.password);
        if (!validPassword) throw new AppError("Invalid email or password", 401);

        const token = sign({ role: user.role }, process.env.JWT_SECRET!, {
            subject: user.id,
            expiresIn: "1d",
        });

        const { password: _, ...userWithoutPassword } = user;
        return res.json({ token, user: userWithoutPassword });
    }
}