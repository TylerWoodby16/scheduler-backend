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
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_service_1 = require("../services/database.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../middlewares/auth");
const mongodb_1 = require("mongodb");
exports.usersRouter = express_1.default.Router();
exports.usersRouter.use(express_1.default.json());
exports.usersRouter.get("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.users)
            throw new Error();
        const groupId = req.headers["x-group-id"];
        const users = yield database_service_1.collections.users
            .find({ groupId: new mongodb_1.ObjectId(groupId), roles: "Student" })
            .toArray();
        res.status(200).send(users);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.usersRouter.get("/cfis", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.users)
            throw new Error();
        const groupId = req.headers["x-group-id"];
        const users = yield database_service_1.collections.users
            .find({ groupId: new mongodb_1.ObjectId(groupId), roles: "CFI" })
            .toArray();
        res.status(200).send(users);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
// Getting one User
exports.usersRouter.get("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.users)
            throw new Error();
        const id = req.params.id;
        const groupId = req.headers["x-group-id"];
        const users = yield database_service_1.collections.users.findOne({
            _id: new mongodb_1.ObjectId(id),
            groupId: new mongodb_1.ObjectId(groupId),
        });
        res.status(200).send(users);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
//literally the copied code from the get"/"" but this one causes a 500 error ??
exports.usersRouter.get("/students", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.users)
            throw new Error();
        const groupId = req.headers["x-group-id"];
        const users = yield database_service_1.collections.users
            .find({ groupId: new mongodb_1.ObjectId(groupId), role: "Student" })
            .toArray();
        res.status(200).send(users);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.usersRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = req.body;
        if (!database_service_1.collections.users)
            throw new Error("No users collection.");
        if (!database_service_1.collections.groups)
            throw new Error("No groups collection.");
        const group = { _id: new mongodb_1.ObjectId(), name: "mga" }; // TODO: DON'T HARDCODE NAME IN THE FUTURE.
        // TODO: MAYBE CHECK THE RESULT OF THESE TWO DATABASE OPERATIONS.
        // TODO: set up these two operations in a TRANSACTION.
        // open the database connection
        // queue up operation one
        // queue up operation two
        // queue up operation ...
        // perform ALL operations
        // if all succeed -> success
        // if ANY fail -> failure
        // -- if there is a failure, ALL of the previous operations will be ROLLED BACK.
        yield database_service_1.collections.groups.insertOne(group);
        const completeUser = {
            _id: new mongodb_1.ObjectId(),
            email: newUser.email,
            password: bcrypt_1.default.hashSync(newUser.password, 10),
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            groupId: group._id,
            roles: ["Admin"],
        };
        yield database_service_1.collections.users.insertOne(completeUser);
        res
            .status(201)
            .send(`Successfully created a new user with ecrypted password `);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
exports.usersRouter.put("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.body._id;
    const groupId = req.headers["x-group-id"];
    try {
        let user = req.body;
        const query = {
            _id: new mongodb_1.ObjectId(id),
            groupId: new mongodb_1.ObjectId(groupId),
        };
        // Enforce that URL params and request body ID match.
        if (id !== req.params.id) {
            res.status(400).send("Param Id does not match req body Id");
            return;
        }
        if (!database_service_1.collections.users)
            throw new Error("No users collection.");
        // TODO: WHY DO WE HAVE TO DO THIS??
        user._id = new mongodb_1.ObjectId(user._id);
        user.groupId = new mongodb_1.ObjectId(user.groupId);
        let updateResult = yield database_service_1.collections.users.findOneAndReplace(query, user);
        console.log(updateResult);
        updateResult
            ? res.status(200).send(`Successfully updated user with id ${id}`)
            : res.status(404).send(`User with id: ${id} not found`);
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
// TODO: consoladate this with the above endpoint
// I need to start cleaning
// bc adding more code to fix problem unnecessarily is low vibrational
exports.usersRouter.put("/lessonadd/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.body._id;
    const groupId = req.headers["x-group-id"];
    console.log("I have made it to the backend point i wanted to ");
    //TODO: have seen bug where it was not posting the lesson
    // keep eye on this
    console.log(req.body);
    try {
        let user = req.body;
        const query = {
            _id: new mongodb_1.ObjectId(id),
            groupId: new mongodb_1.ObjectId(groupId),
        };
        // Enforce that URL params and request body ID match.
        if (id !== req.params.id) {
            res.status(400).send("Param Id does not match req body Id");
            return;
        }
        if (!database_service_1.collections.users)
            throw new Error("No users collection.");
        // TODO: WHY DO WE HAVE TO DO THIS??
        user._id = new mongodb_1.ObjectId(user._id);
        user.groupId = new mongodb_1.ObjectId(user.groupId);
        let updateResult = yield database_service_1.collections.users.findOneAndReplace(query, user);
        console.log(updateResult);
        updateResult
            ? res.status(200).send(`Successfully updated user with id ${id}`)
            : res.status(404).send(`User with id: ${id} not found`);
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
