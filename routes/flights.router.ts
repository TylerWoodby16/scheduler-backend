import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import Aircraft, { AirworthinessDirective } from "../models/aircraft";
import { verifyToken } from "../middlewares/auth";
import { ObjectId } from "mongodb";
import { adminOnly } from "../middlewares/adminCheck";
import Flight from "../models/flight";

export const flightsRouter = express.Router();

flightsRouter.use(express.json());

flightsRouter.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const newFlight = req.body as Flight;
    newFlight._id = new ObjectId();
    const groupId = req.headers["x-group-id"] as string;
    newFlight.groupId = new ObjectId(groupId);

    if (!collections.flights) throw new Error();

    const result = await collections.flights.insertOne(newFlight);

    result
      ? res
          .status(201)
          .send(
            `Successfully created a new flight with id ${result.insertedId}`
          )
      : res.status(500).send("Failed to create a new flight.");
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});
