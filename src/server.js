import express from "express";
import movieRoutes from "./routes/movie.routes.js";
import authRoutes from "./routes/auth.routes.js";
import watchlistRoutes from "./routes/watchlist.routes.js"
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

config();

const app = express();
const PORT = process.env.PORT || 5001;
let server;


// Parse JSON and urlencoded request bodies so `req.body` is populated
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/movies",movieRoutes);
app.use(authRoutes);
app.use("/watchlist",watchlistRoutes);

async function start() {
    try {
        await connectDB();
        server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Startup error:", err);
        process.exit(1);
    }
}

start();

process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    if (server) {
        server.close(async () => {
            await disconnectDB();
            process.exit(1);
        });
    } else {
        disconnectDB().then(() => process.exit(1));
    }
});

process.on("uncaughtException", async (error) => {
    console.error("Uncaught Exception:", error);
    if (server) {
        server.close(async () => {
            await disconnectDB();
            process.exit(1);
        });
    } else {
        await disconnectDB();
        process.exit(1);
    }
});

process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    if (server) {
        server.close(async () => {
            await disconnectDB();
            process.exit(0);
        });
    } else {
        await disconnectDB();
        process.exit(0);
    }
});

app.use(movieRoutes);
app.use(authRoutes);