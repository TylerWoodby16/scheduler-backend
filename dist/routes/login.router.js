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
exports.loginRouter = express_1.default.Router();
exports.loginRouter.use(express_1.default.json());
exports.loginRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginForm = req.body;
        if (!database_service_1.collections.users)
            throw new Error();
        const foundUser = yield database_service_1.collections.users.findOne({ email: loginForm.email });
        console.log(foundUser);
        res.status(200).send("blam");
        // const result = await collections.users.insertOne(newUser);
        // result
        //     ? res.status(201).send(`Successfully created a new user with id ${result.insertedId}`)
        //     : res.status(500).send("Failed to create a new user.");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
