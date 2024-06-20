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
exports.lessonsRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_service_1 = require("../services/database.service");
const auth_1 = require("../middlewares/auth");
exports.lessonsRouter = express_1.default.Router();
exports.lessonsRouter.use(express_1.default.json());
exports.lessonsRouter.post("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(res);
        if (!database_service_1.collections.lessons)
            throw new Error("No lessons collection.");
        // if (!collections.groups) throw new Error("No groups collection.");
        // const group = { _id: new ObjectId(), name: "mga" };
        // await collections.groups.insertOne(group);
        //TODO: find out how to post the info that was posted as opposed to the hardcoded version
        const completeLesson = {
            sections: ["wtf"],
        };
        console.log(completeLesson);
        yield database_service_1.collections.lessons.insertOne(completeLesson);
        res.status(201).send(`Successfully created a new lesson `);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
exports.lessonsRouter.get("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.lessons)
            throw new Error();
        const groupId = req.headers["x-group-id"];
        const lessons = yield database_service_1.collections.lessons
            // .find({ groupId: new ObjectId(groupId) })
            .find({ sections: ["wtf"] })
            .toArray();
        res.status(200).send(lessons);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
