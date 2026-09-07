import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

export function createApp() {
    const app = express();
    app.use(cors());
    app.use(helmet());
    app.use(morgan("dev"));
    app.use(express.json());

    app.get("/health", (req, res) => {
        res.status(200).json({ status: "ok" });
    });

    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    });

    return app;
}