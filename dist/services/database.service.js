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
        const personalizedDataCollection = db.collection(process.env.PERSONALIZEDDATACOLLECTION_COLLECTION_NAME);
        const lessonsCollection = db.collection(process.env.LESSONS_COLLECTION_NAME);
        // Persist the connection to the aircrafts collection
        exports.collections.aircrafts = aircraftsCollection;
        exports.collections.users = usersCollection;
        exports.collections.groups = groupsCollection;
        exports.collections.flights = flightsCollection;
        exports.collections.personalizedData = personalizedDataCollection;
        exports.collections.lessons = lessonsCollection;
        console.log(`Successfully connected to database: ${db.databaseName}`);
    });
}
exports.connectToDatabase = connectToDatabase;
