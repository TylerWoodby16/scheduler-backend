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
exports.flightsRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_service_1 = require("../services/database.service");
const auth_1 = require("../middlewares/auth");
const mongodb_1 = require("mongodb");
exports.flightsRouter = express_1.default.Router();
exports.flightsRouter.use(express_1.default.json());
exports.flightsRouter.post("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newAircraft = req.body;
        newAircraft._id = new mongodb_1.ObjectId();
        const groupId = req.headers["x-group-id"];
        newAircraft.groupId = new mongodb_1.ObjectId(groupId);
        if (!database_service_1.collections.aircrafts)
            throw new Error();
        const result = yield database_service_1.collections.aircrafts.insertOne(newAircraft);
        result
            ? res
                .status(201)
                .send(`Successfully created a new aircraft with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new aircraft.");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
