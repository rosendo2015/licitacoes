import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "../utils/AppError";

export class LicitacoesController {
    // Criar uma nova licitação
    async create(req: Request, res: Response) {
        const {
            data,
            horarioInicio,
            estado,
            orgao,
            pregao,
            servico,
            uasg,
            observacoes,
            status
        } = req.body;

        if (!req.user) {
            throw new AppError("Usuário não autenticado", 401);
        }

        const licitacao = await prisma.licitacao.create({
            data: {
                data: new Date(data), // garante que é DateTime
                horarioInicio,
                estado,
                orgao,
                pregao,
                servico,
                uasg,
                observacoes,
                status,
                userId: req.user.id,
            },
        });

        return res.status(201).json(licitacao);
    }

    // Listar todas as licitações
    async index(req: Request, res: Response) {
        const licitacoes = await prisma.licitacao.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return res.json(licitacoes);
    }

    // Buscar uma licitação específica
    async show(req: Request, res: Response) {
        const { id } = req.params;

        const licitacao = await prisma.licitacao.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        if (!licitacao) throw new AppError("Licitação não encontrada", 404);

        return res.json(licitacao);
    }

    // Atualizar uma licitação
    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { titulo, descricao, status } = req.body;

        const licitacao = await prisma.licitacao.findUnique({ where: { id } });
        if (!licitacao) throw new AppError("Licitação não encontrada", 404);

        // opcional: verificar se o usuário autenticado é dono da licitação
        if (licitacao.userId !== req.user?.id) {
            throw new AppError("Você não tem permissão para editar esta licitação", 403);
        }

        const updated = await prisma.licitacao.update({
            where: { id },
            data: { titulo, descricao, status },
        });

        return res.json(updated);
    }

    // Excluir uma licitação
    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const licitacao = await prisma.licitacao.findUnique({ where: { id } });
        if (!licitacao) throw new AppError("Licitação não encontrada", 404);

        if (licitacao.userId !== req.user?.id) {
            throw new AppError("Você não tem permissão para excluir esta licitação", 403);
        }

        await prisma.licitacao.delete({ where: { id } });

        return res.status(204).send();
    }
}