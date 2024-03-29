"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = exports.collections = void 0;
const mongoDB = __importStar(require("mongodb"));
const dotenv = __importStar(require("dotenv"));
exports.collections = {};
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        // Pulls in the .env file so it can be accessed from process.env. No path as .env is in root, the default location
        dotenv.config({ path: "./config.env" });
        // Create a new MongoDB client with the connection string from .env
        const client = new mongoDB.MongoClient(process.env.ATLAS_URI);
        // Connect to the cluster
        yield client.connect();
        // Connect to the database with the name specified in .env
        const db = client.db(process.env.DB_NAME);
        // Apply schema validation to the collection
        // await applySchemaValidation(db);
        // Connect to the collection with the specific name from .env, found in the database previously specified
        const aircraftsCollection = db.collection(process.env.AIRCRAFTS_COLLECTION_NAME);
        const usersCollection = db.collection(process.env.USERS_COLLECTION_NAME);
        const groupsCollection = db.collection(process.env.GROUPS_COLLECTION_NAME);
        const flightsCollection = db.collection(process.env.FLIGHTS_COLLECTION_NAME);
        // Persist the connection to the aircrafts collection
        exports.collections.aircrafts = aircraftsCollection;
        exports.collections.users = usersCollection;
        exports.collections.groups = groupsCollection;
        exports.collections.flights = flightsCollection;
        console.log(`Successfully connected to database: ${db.databaseName}`);
    });
}
exports.connectToDatabase = connectToDatabase;
// TODO: DEAL WITH DATABASE VALIDATION
// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our aircraft model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
// async function applySchemaValidation(db: mongoDB.Db) {
//     const jsonSchema = {
//         $jsonSchema: {
//             bsonType: "object",
//             required: ["name", "price", "category"],
//             additionalProperties: false,
//             properties: {
//                 _id: {},
//                 name: {
//                     bsonType: "string",
//                     description: "'name' is required and is a string",
//                 },
//                 price: {
//                     bsonType: "number",
//                     description: "'price' is required and is a number",
//                 },
//                 category: {
//                     bsonType: "string",
//                     description: "'category' is required and is a string",
//                 },
//             },
//         },
//     };
//     // Try applying the modification to the collection, if the collection doesn't exist, create it
//    await db.command({
//         collMod: process.env.aircraftS_COLLECTION_NAME,
//         validator: jsonSchema
//     }).catch(async (error: mongoDB.MongoServerError) => {
//         if (error.codeName === 'NamespaceNotFound') {
//             await db.createCollection(process.env.aircraftS_COLLECTION_NAME, {validator: jsonSchema});
//         }
//     });
// }
