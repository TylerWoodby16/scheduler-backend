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
const mongodb_1 = require("mongodb");
exports.lessonsRouter = express_1.default.Router();
exports.lessonsRouter.use(express_1.default.json());
exports.lessonsRouter.post("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newLesson = req.body;
        newLesson._id = new mongodb_1.ObjectId();
        const groupId = req.headers["x-group-id"];
        newLesson.groupId = new mongodb_1.ObjectId(groupId);
        if (!database_service_1.collections.lessons)
            throw new Error("No lessons collection.");
        yield database_service_1.collections.lessons.insertOne(newLesson);
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
            .find()
            .toArray();
        console.log(lessons);
        res.status(200).send(lessons);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
//TODO: make a get route with a specific id
exports.lessonsRouter.get("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!database_service_1.collections.aircrafts)
            throw new Error();
        const id = req.params.id;
        const groupId = req.headers["x-group-id"];
        const lesson = yield ((_a = database_service_1.collections.lessons) === null || _a === void 0 ? void 0 : _a.findOne({
            _id: new mongodb_1.ObjectId(id),
        }));
        res.status(200).send(lesson);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.lessonsRouter.delete("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const groupId = req.headers["x-group-id"];
    if (!database_service_1.collections.lessons)
        throw new Error();
    // TODO: bring back the groupID HAHHA
    // const query = { _id: new ObjectId(id), groupId: new ObjectId(groupId) };
    const query = { _id: new mongodb_1.ObjectId(id) };
    const result = yield database_service_1.collections.lessons.deleteOne(query);
    try {
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed lesson with id `);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove lesson with id `);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Lesson with id does not exist`);
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
