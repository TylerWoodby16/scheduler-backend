"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_service_1 = require("../services/database.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.loginRouter = express_1.default.Router();
exports.loginRouter.use(express_1.default.json());
exports.loginRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginForm = req.body;
        if (!database_service_1.collections.users)
            throw new Error();
        // Determine if user exists by looking them up by email.
        const foundUser = yield database_service_1.collections.users.findOne({
            email: loginForm.email,
        });
        if (!foundUser) {
            res.status(404).send("User not found.");
            return;
        }
        // Compare password from login form with found user's password.
        const isValidPassword = bcrypt_1.default.compareSync(loginForm.password, foundUser.password);
        if (isValidPassword) {
            const token = jsonwebtoken_1.default.sign({
                userId: foundUser._id,
                userRole: foundUser.role,
            }, process.env.TOKEN_KEY, {
                expiresIn: "2h",
            });
            res.status(200).send({ token: token });
        }
        else {
            res.status(401).send("Password incorrect.");
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
