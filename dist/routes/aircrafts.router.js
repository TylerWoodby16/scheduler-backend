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
exports.aircraftsRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_service_1 = require("../services/database.service");
const auth_1 = require("../middlewares/auth");
const mongodb_1 = require("mongodb");
exports.aircraftsRouter = express_1.default.Router();
exports.aircraftsRouter.use(express_1.default.json());
exports.aircraftsRouter.get("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.aircrafts)
            throw new Error();
        const userId = req.headers["x-user-id"];
        const aircrafts = yield database_service_1.collections.aircrafts.find({ userId: new mongodb_1.ObjectId(userId) }).toArray();
        res.status(200).send(aircrafts);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.aircraftsRouter.post("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newAircraft = req.body;
        const userId = req.headers["x-user-id"];
        newAircraft.userId = new mongodb_1.ObjectId(userId);
        if (!database_service_1.collections.aircrafts)
            throw new Error();
        const result = yield database_service_1.collections.aircrafts.insertOne(newAircraft);
        result
            ? res.status(201).send(`Successfully created a new aircraft with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new aircraft.");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
exports.aircraftsRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    // We need to enforce that id in params matches id in request body.
    try {
        const updatedAircraft = req.body;
        const query = { _id: updatedAircraft._id };
        // $set adds or updates all fields
        if (!database_service_1.collections.aircrafts)
            throw new Error();
        const result = yield database_service_1.collections.aircrafts.updateOne(query, { $set: updatedAircraft });
        result
            ? res.status(200).send(`Successfully updated game with id ${id}`)
            : res.status(304).send(`Game with id: ${id} not updated`);
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
exports.aircraftsRouter.put("/updateMany/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const name = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.name;
    // We need to enforce that id in params matches id in request body.
    try {
        const update = req.body;
        const query = { name: name };
        // $set adds or updates all fields
        if (!database_service_1.collections.aircrafts)
            throw new Error();
        const result = yield database_service_1.collections.aircrafts.updateMany(query, { $set: { year: update.year } });
        // updating aircraft by req.body on line 65 could cause issues 
        result
            ? res.status(200).send(`Successfully updated`)
            : res.status(304).send(`not updated`);
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
// aircraftsRouter.delete("/:id", async (req: Request, res: Response) => {
//     const id = Number(req?.params?.id);
//     try {
//         const query = { _id: id };
//         if(!collections.aircrafts) throw new Error();
//         const result = await collections.aircrafts.deleteOne(query);
//         if (result && result.deletedCount) {
//             res.status(202).send(`Successfully removed game with id ${id}`);
//         } else if (!result) {
//             res.status(400).send(`Failed to remove game with id ${id}`);
//         } else if (!result.deletedCount) {
//             res.status(404).send(`Game with id ${id} does not exist`);
//         }
//     } catch (error: any) {
//         console.error(error.message);
//         res.status(400).send(error.message);
//     }
// });
exports.aircraftsRouter.delete("/deleteMany/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const name = (_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.name;
    try {
        const query = { name: name };
        if (!database_service_1.collections.aircrafts)
            throw new Error();
        const result = yield database_service_1.collections.aircrafts.deleteMany(query);
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed with names ${name}`);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove with name ${name}`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Airplane with name ${name} does not exist`);
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
