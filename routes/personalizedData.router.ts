import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import Aircraft, { AirworthinessDirective } from "../models/aircraft";
import { verifyToken } from "../middlewares/auth";
import { ObjectId } from "mongodb";
import Flight from "../models/flight";
import PersonalizedData from "../models/personalizedData";
import { lessonsRouter } from "./lessons.router";

export const personalizedDataRouter = express.Router();

personalizedDataRouter.use(express.json());

personalizedDataRouter.get(
  "/",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      if (!collections.personalizedData) throw new Error();

      const groupId = req.headers["x-group-id"] as string;

      const personalizedData = await collections.personalizedData
        .find()
        .toArray();

      res.status(200).send(personalizedData);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

personalizedDataRouter.get(
  "/:userid",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      console.log("made it here");

      if (!collections.personalizedData) throw new Error();

      const groupId = req.headers["x-group-id"] as string;
      const lessonId = req.params.lessonId;
      const userId = req.params.userid; // Access the user ID from the route parameter
      console.log(userId + "look here");

      // Query the personalized data using the user ID
      const personalizedData = await collections.personalizedData
        .find()
        .toArray();

      res.status(200).send(personalizedData);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

personalizedDataRouter.get(
  "/:date",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      if (!collections.personalizedData) throw new Error();

      const groupId = req.headers["x-group-id"] as string;
      const date = req.params.date;

      const flights = await collections.personalizedData
        .find({
          groupId: new ObjectId(groupId),
          date: date,
        })
        .toArray();
      //  TODO: Look  at wtf is going on

      // Sort the flights array by startTime.
      // flights.sort((flight1, flight2) => {
      //   return flight1.startTime.getTime() - flight2.startTime.getTime();
      // });

      res.status(200).send(flights);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

personalizedDataRouter.post(
  "/",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      console.log("made it");
      const { lessonId, studentUserId } = req.body as Flight;
      const newPersonalizedData = {
        lessonId: lessonId,
        userId: studentUserId,
      } as PersonalizedData;
      // const newPersonalizedData = req.body as PersonalizedData;
      newPersonalizedData._id = new ObjectId();
      const groupId = req.headers["x-group-id"] as string;
      // newPersonalizedData.groupId = new ObjectId(groupId);
      // Force startTime and endTime to be Dates because they want to be strings.

      // TODO: MAKE SURE AIRCRAFTID IS OBJECT ID.

      if (!collections.personalizedData) throw new Error();
      console.log(newPersonalizedData);
      const result = await collections.personalizedData.insertOne(
        newPersonalizedData
      );

      result
        ? res
            .status(201)
            .send(
              `Successfully created a new flight with id ${result.insertedId}`
            )
        : res.status(500).send("Failed to create a new flight.");
    } catch (error: any) {
      res.status(400).send(error.message);
      console.log("made it");
    }
  }
);

// make sure that I update this to make sense with the flight router
// this is copy and pasted in from the aircraft router
personalizedDataRouter.put(
  "/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    // TODO: ensure that ID in params and ID in body are the same. if not, send back 404.
    // const id = req?.params?.id;
    const id = req.body._id;
    const groupId = req.headers["x-group-id"] as string;

    // We need to enforce that id in params matches id in request body.
    try {
      const updatedFlight = req.body as Flight;

      const query = {
        _id: new ObjectId(updatedFlight._id),
        groupId: new ObjectId(groupId),
      };

      if (!collections.flights) throw new Error();

      // TODO: WHY DO WE HAVE TO DO THIS??
      // bc the id is turned into a string and this turns it back into a ObjectId('')
      updatedFlight._id = new ObjectId(updatedFlight._id);
      updatedFlight.groupId = new ObjectId(updatedFlight.groupId);
      // Force startTime and endTime to be Dates because they want to be strings.
      updatedFlight.startTime = new Date(updatedFlight.startTime);
      updatedFlight.endTime = new Date(updatedFlight.endTime);

      const result = await collections.flights.findOneAndReplace(
        query,
        updatedFlight
      );

      result
        ? res.status(200).send(`Successfully updated aircraft with id ${id} }`)
        : res.status(304).send(`Aircraft with id: ${id} not updated`);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }
);

personalizedDataRouter.delete(
  "/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    // console.log(id);

    const groupId = req.headers["x-group-id"] as string;

    if (!collections.flights) throw new Error();

    try {
      const query = { _id: new ObjectId(id), groupId: new ObjectId(groupId) };
      const result = await collections.flights.deleteOne(query);

      if (result && result.deletedCount) {
        res.status(202).send(`Successfully removed flight`);
      } else if (!result) {
        res.status(400).send(`Failed to remove flight`);
      } else if (!result.deletedCount) {
        res.status(404).send(`Flight does not exist`);
      }
    } catch (error: any) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
);
