import express from "express";
import "express-async-errors"; // para erros assíncronos
import { errorHandling } from "./middleware/error-handling";
import routes from "./routes";

const app = express();
app.use(express.json());
app.use(routes);
app.use(errorHandling);

export { app };