import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";

export function createApp() {
    const app = express();
    app.use(cors());
    app.use(helmet());
    app.use(morgan("dev"));
    app.use(express.json());

    app.get("/health", (_req, res) => {
        res.json({ status: "ok", service: "identity-service" });
    });

    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/users", usersRoutes);

    app.use(errorHandler);

    return app;
}