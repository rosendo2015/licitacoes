import { Router } from "express";
import { UsersController } from "@/controllers/user-controller";

const usersRoutes = Router();
const usersController = new UsersController();

// Cadastro de usuário
usersRoutes.post("/", usersController.create);

export { usersRoutes };