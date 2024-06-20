import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import Aircraft from "../models/aircraft";
import User from "../models/user";
import Group from "../models/group";
import Flight from "../models/flight";
import PersonalizedData from "../models/personalizedData";
import Lesson from "../models/lesson";

export const collections: {
  aircrafts?: mongoDB.Collection<Aircraft>;
  users?: mongoDB.Collection<User>;
  groups?: mongoDB.Collection<Group>;
  flights?: mongoDB.Collection<Flight>;
  personalizedData?: mongoDB.Collection<PersonalizedData>;
  lessons?: mongoDB.Collection<Lesson>;
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
  const flightsCollection = db.collection<Flight>(
    process.env.FLIGHTS_COLLECTION_NAME!
  );
  const personalizedDataCollection = db.collection<PersonalizedData>(
    process.env.PERSONALIZEDDATACOLLECTION_COLLECTION_NAME!
  );
  const lessonsCollection = db.collection<Lesson>(
    process.env.LESSONS_COLLECTION_NAME!
  );

  // Persist the connection to the aircrafts collection
  collections.aircrafts = aircraftsCollection;
  collections.users = usersCollection;
  collections.groups = groupsCollection;
  collections.flights = flightsCollection;
  collections.personalizedData = personalizedDataCollection;
  collections.lessons = lessonsCollection;

  console.log(`Successfully connected to database: ${db.databaseName}`);
}
