import { Router } from "express";
import { SessionsController } from "@/controllers/sessions-controller";

const sessionsRoutes = Router();
const sessionsController = new SessionsController();

// Autenticação de usuário
sessionsRoutes.post("/", sessionsController.create);

export { sessionsRoutes };