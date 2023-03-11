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
const adminCheck_1 = require("../middlewares/adminCheck");
exports.aircraftsRouter = express_1.default.Router();
exports.aircraftsRouter.use(express_1.default.json());
exports.aircraftsRouter.get("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.aircrafts)
            throw new Error();
        const groupId = req.headers["x-group-id"];
        const aircrafts = yield database_service_1.collections.aircrafts
            .find({ groupId: new mongodb_1.ObjectId(groupId) })
            .toArray();
        res.status(200).send(aircrafts);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.aircraftsRouter.get("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.aircrafts)
            throw new Error();
        const id = req.params.id;
        const groupId = req.headers["x-group-id"];
        const aircraft = yield database_service_1.collections.aircrafts.findOne({
            _id: new mongodb_1.ObjectId(id),
            groupId: new mongodb_1.ObjectId(groupId),
        });
        res.status(200).send(aircraft);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.aircraftsRouter.post("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.aircraftsRouter.put("/bruteUpsert", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // make variable with mongo query to findall aircraft names
        // if statement comparing the newAircraft name against the variable we just made
        // if it matches update
        // if it does not match insert
        // if the request body (the aircraft) contains an ID -> update
        // if the request body doesn't contain an ID -> insert
        if (!database_service_1.collections.aircrafts)
            throw new Error();
        const groupId = req.headers["x-group-id"];
        // const aircrafts = await collections.aircrafts; why did we rename it here ?
        const allAircrafts = yield database_service_1.collections.aircrafts
            .find({ groupId: new mongodb_1.ObjectId(groupId) })
            .toArray();
        let ticker = false;
        const newAircraft = req.body;
        const userId = req.headers["x-user-id"];
        newAircraft.userId = new mongodb_1.ObjectId(userId);
        allAircrafts.forEach((aircraft) => {
            if (aircraft.name == newAircraft.name) {
                ticker = true;
            }
        });
        if (ticker) {
            const query = { name: newAircraft.name };
            const result = yield database_service_1.collections.aircrafts.updateOne(query, {
                $set: { year: newAircraft.year },
            });
            // respond with status code
            result
                ? res.status(201).send(
                //?
                `Successfully created a new aircraft with id`)
                : res.status(500).send("Failed to create a new aircraft.");
        }
        else {
            // the standard insert
            const result = yield database_service_1.collections.aircrafts.insertOne(newAircraft);
            result
                ? res.status(201).send(
                //?
                `Successfully created a new aircraft with id ${result.insertedId}`)
                : res.status(500).send("Failed to create a new aircraft.");
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
exports.aircraftsRouter.put("/gentleUpsert", auth_1.verifyToken, adminCheck_1.adminOnly, 
// groupOnly,
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // make variable with mongo query to findall aircraft names
    // if statement comparing the newAircraft name against the variable we just made
    // if it matches update
    // if it does not match insert
    // if the request body (the aircraft) contains an ID -> update
    // if the request body doesn't contain an ID -> insert
    //this is where the groupId insert ends
    // USE THIS TECHNIQUE FOR THIS ENDPOINT
    // if the request body (the aircraft) contains an ID -> update
    // if the request body doesn't contain an ID -> insert
    if (!database_service_1.collections.aircrafts)
        throw new Error();
    let newAircraft = req.body;
    const groupId = req.headers["x-group-id"];
    // i beleive we will need to get the group id here, and add a second param to the search
    //newAircraft.groupId = new ObjectId(groupId);
    if (newAircraft._id.toString() != "") {
        try {
            const query = {
                _id: new mongodb_1.ObjectId(newAircraft._id),
                groupId: new mongodb_1.ObjectId(groupId),
            };
            //if name exists, then update the year.
            const result = yield database_service_1.collections.aircrafts.updateOne(query, {
                $set: { year: newAircraft.year },
            });
            // in update case, also make sure to respond with the correct status code.
            result
                ? res.status(200).send(`Successfully created a new aircraft with id`)
                : res.status(500).send("Failed to create a new aircraft.");
        }
        catch (error) {
            res.status(500).send("Failed to update aircraft.");
        }
    }
    else {
        //the standard insert
        try {
            const userId = req.headers["x-user-id"];
            const groupId = req.headers["x-group-id"];
            // uh oh do i have to insert group id ?? did or does it come when i insert it initially
            newAircraft.userId = new mongodb_1.ObjectId(userId);
            // newAircraft._id = new ObjectId(groupId);
            newAircraft.groupId = new mongodb_1.ObjectId(groupId);
            // this is where the problem lies ??? maybe not
            const result = yield database_service_1.collections.aircrafts.insertOne(newAircraft);
            result
                ? res
                    .status(201)
                    .send(`Successfully created a new aircraft with id ${result.insertedId}`)
                : res.status(500).send("Failed to create a new aircraft.");
        }
        catch (error) {
            res.status(500).send("Failed to create new aircraft.");
        }
    }
}));
exports.aircraftsRouter.put("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.headers["x-user-id"];
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    // We need to enforce that id in params matches id in request body.
    try {
        const updatedAircraft = req.body;
        const query = { _id: updatedAircraft._id };
        // $set adds or updates all fields
        if (!database_service_1.collections.aircrafts)
            throw new Error();
        const result = yield database_service_1.collections.aircrafts.updateOne(query, {
            $set: updatedAircraft,
        });
        result
            ? res.status(200).send(`Successfully updated game with id ${id}`)
            : res.status(304).send(`Game with id: ${id} not updated`);
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
exports.aircraftsRouter.put("/updateMany/:name/:more/:stuff", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const name = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.name;
    // We need to enforce that id in params matches id in request body.
    try {
        const update = req.body;
        const query = { name: name };
        // $set adds or updates all fields
        if (!database_service_1.collections.aircrafts)
            throw new Error();
        const result = yield database_service_1.collections.aircrafts.updateMany(query, {
            $set: { year: update.year },
        });
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
exports.aircraftsRouter.delete("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userId = req.headers["x-user-id"];
    if (!database_service_1.collections.aircrafts)
        throw new Error();
    const query = { _id: new mongodb_1.ObjectId(id), userId: new mongodb_1.ObjectId(userId) };
    const result = yield database_service_1.collections.aircrafts.deleteOne(query);
    try {
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed game with id `);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove game with id `);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Aircraft with id does not exist`);
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
// aircraftsRouter.delete(
//   "/deleteMany/:name",
//   async (req: Request, res: Response) => {
//     const name = req?.params?.name;
//     try {
//       const query = { name: name };
//       if (!collections.aircrafts) throw new Error();
//       const result = await collections.aircrafts.deleteMany(query);
//       if (result && result.deletedCount) {
//         res.status(202).send(`Successfully removed with names ${name}`);
//       } else if (!result) {
//         res.status(400).send(`Failed to remove with name ${name}`);
//       } else if (!result.deletedCount) {
//         res.status(404).send(`Airplane with name ${name} does not exist`);
//       }
//     } catch (error: any) {
//       console.error(error.message);
//       res.status(400).send(error.message);
//     }
//   }
// );
