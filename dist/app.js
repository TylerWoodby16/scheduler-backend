"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_service_1 = require("./services/database.service");
const aircrafts_router_1 = require("./routes/aircrafts.router");
const users_router_1 = require("./routes/users.router");
const login_router_1 = require("./routes/login.router");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './config.env' });
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
var cors = require('cors');
app.use(cors());
(0, database_service_1.connectToDatabase)()
    .then(() => {
    // send all calls to /games to our gamesRouter
    app.use("/aircrafts", aircrafts_router_1.aircraftsRouter);
    app.use("/users", users_router_1.usersRouter);
    app.use("/login", login_router_1.loginRouter);
    // start the Express server
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
})
    .catch((error) => {
    console.error("Database connection failed", error);
    process.exit();
});
