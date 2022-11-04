import express, {Express} from "express";
import { connectToDatabase } from "./services/database.service";
import { aircraftsRouter } from "./routes/aircrafts.router";
import { usersRouter } from "./routes/users.router";
import { loginRouter } from "./routes/login.router";
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const app: Express = express();
const port = process.env.PORT || 5000;

connectToDatabase()
    .then(() => {
        // send all calls to /games to our gamesRouter
        app.use("/aircrafts", aircraftsRouter);
        app.use("/users", usersRouter);
        app.use("/login", loginRouter);

        // start the Express server
        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });