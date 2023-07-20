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
exports.flightsRouter.get("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.flights)
            throw new Error();
        const groupId = req.headers["x-group-id"];
        const flights = yield database_service_1.collections.flights
            .find({
            groupId: new mongodb_1.ObjectId(groupId),
        })
            .toArray();
        res.status(200).send(flights);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.flightsRouter.get("/:date", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.flights)
            throw new Error();
        const groupId = req.headers["x-group-id"];
        const date = req.params.date;
        const flights = yield database_service_1.collections.flights
            .find({
            groupId: new mongodb_1.ObjectId(groupId),
            date: date,
        })
            .toArray();
        res.status(200).send(flights);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.flightsRouter.post("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newFlight = req.body;
        newFlight._id = new mongodb_1.ObjectId();
        const groupId = req.headers["x-group-id"];
        newFlight.groupId = new mongodb_1.ObjectId(groupId);
        if (!database_service_1.collections.flights)
            throw new Error();
        // console.log(newFlight);
        const result = yield database_service_1.collections.flights.insertOne(newFlight);
        result
            ? res
                .status(201)
                .send(`Successfully created a new flight with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new flight.");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
// make sure that I update this to make sense with the flight router
// this is copy and pasted in from the aircraft router
exports.flightsRouter.put("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: ensure that ID in params and ID in body are the same. if not, send back 404.
    // const id = req?.params?.id;
    const id = req.body._id;
    const groupId = req.headers["x-group-id"];
    // We need to enforce that id in params matches id in request body.
    try {
        const updatedFlight = req.body;
        const query = {
            _id: new mongodb_1.ObjectId(updatedFlight._id),
            groupId: new mongodb_1.ObjectId(groupId),
        };
        if (!database_service_1.collections.flights)
            throw new Error();
        // TODO: WHY DO WE HAVE TO DO THIS??
        // bc the id is turned into a string and this turns it back into a ObjectId('')
        updatedFlight._id = new mongodb_1.ObjectId(updatedFlight._id);
        updatedFlight.groupId = new mongodb_1.ObjectId(updatedFlight.groupId);
        const result = yield database_service_1.collections.flights.findOneAndReplace(query, updatedFlight);
        result
            ? res.status(200).send(`Successfully updated aircraft with id ${id} }`)
            : res.status(304).send(`Aircraft with id: ${id} not updated`);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
exports.flightsRouter.delete("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    // console.log(id);
    const groupId = req.headers["x-group-id"];
    if (!database_service_1.collections.flights)
        throw new Error();
    try {
        const query = { _id: new mongodb_1.ObjectId(id), groupId: new mongodb_1.ObjectId(groupId) };
        const result = yield database_service_1.collections.flights.deleteOne(query);
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed flight`);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove flight`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Flight does not exist`);
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
