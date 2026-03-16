import { Router } from "express";
import { LicitacoesController } from "../controllers/licitacoes-controller";
import { ensureAuthenticated } from "../middleware/ensureAutenticated";

const licitacoesRoutes = Router();
const licitacoesController = new LicitacoesController();

// Rotas protegidas com autenticação
licitacoesRoutes.post("/", ensureAuthenticated, licitacoesController.create);
licitacoesRoutes.get("/", ensureAuthenticated, licitacoesController.index);
licitacoesRoutes.get("/:id", ensureAuthenticated, licitacoesController.show);
licitacoesRoutes.put("/:id", ensureAuthenticated, licitacoesController.update);
licitacoesRoutes.delete("/:id", ensureAuthenticated, licitacoesController.delete);

export { licitacoesRoutes };