import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import "express-async-errors"; // captura erros em funções assíncronas
import { AppError } from "./utils/AppError";

// importa as rotas separadas
import { usersRoutes } from "./routes/users-routes";
import { sessionsRoutes } from "./routes/sessions-routes";
import { licitacoesRoutes } from "./routes/licitacoes-routes";


const app = express();

app.use(cors());
app.use(express.json());

// registra as rotas
app.use("/users", usersRoutes);
app.use("/sessions", sessionsRoutes);
app.use("/licitacoes", licitacoesRoutes)

// middleware global de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));