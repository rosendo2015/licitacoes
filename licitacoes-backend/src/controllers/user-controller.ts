import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { hash } from "bcrypt";
import z from "zod";

export class UsersController {
    async create(req: Request, res: Response) {
        const schema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(6),
        });

        const { name, email, password } = schema.parse(req.body);

        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) throw new AppError("Email already registered", 400);

        const hashedPassword = await hash(password, 8);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        const { password: _, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
    }
}