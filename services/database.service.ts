import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import Aircraft from "../models/aircraft";
import User from "../models/user";
import Group from "../models/group";

export const collections: {
  aircrafts?: mongoDB.Collection<Aircraft>;
  users?: mongoDB.Collection<User>;
  groups?: mongoDB.Collection<Group>;
} = {};

export async function connectToDatabase() {
  // Pulls in the .env file so it can be accessed from process.env. No path as .env is in root, the default location
  dotenv.config({ path: "./config.env" });

  // Create a new MongoDB client with the connection string from .env
  const client = new mongoDB.MongoClient(process.env.ATLAS_URI!);

  // Connect to the cluster
  await client.connect();

  // Connect to the database with the name specified in .env
  const db = client.db(process.env.DB_NAME);

  // Apply schema validation to the collection
  // await applySchemaValidation(db);

  // Connect to the collection with the specific name from .env, found in the database previously specified
  const aircraftsCollection = db.collection<Aircraft>(
    process.env.AIRCRAFTS_COLLECTION_NAME!
  );
  const usersCollection = db.collection<User>(
    process.env.USERS_COLLECTION_NAME!
  );
  const groupsCollection = db.collection<Group>(
    process.env.GROUPS_COLLECTION_NAME!
  );

  // Persist the connection to the aircrafts collection
  collections.aircrafts = aircraftsCollection;
  collections.users = usersCollection;
  collections.groups = groupsCollection;

  console.log(`Successfully connected to database: ${db.databaseName}`);
}

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
