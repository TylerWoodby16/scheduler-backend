import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import Aircraft, { AirworthinessDirective } from "../models/aircraft";
import { verifyToken } from "../middlewares/auth";
import { ObjectId } from "mongodb";
import Flight from "../models/flight";

export const flightsRouter = express.Router();

flightsRouter.use(express.json());

flightsRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    if (!collections.flights) throw new Error();

    const groupId = req.headers["x-group-id"] as string;

    const flights = await collections.flights
      .find({
        groupId: new ObjectId(groupId),
      })
      .toArray();

    res.status(200).send(flights);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

flightsRouter.get(
  "/:date",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      if (!collections.flights) throw new Error();

      const groupId = req.headers["x-group-id"] as string;
      const date = req.params.date;
      console.log("this is the date" + date);

      const flights = await collections.flights
        .find({
          groupId: new ObjectId(groupId),
          date: date,
        })
        .toArray();

      res.status(200).send(flights);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

flightsRouter.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const newFlight = req.body as Flight;
    newFlight._id = new ObjectId();
    const groupId = req.headers["x-group-id"] as string;
    newFlight.groupId = new ObjectId(groupId);
    // Force startTime and endTime to be Dates because they want to be strings.
    newFlight.startTime = new Date(newFlight.startTime);
    newFlight.endTime = new Date(newFlight.endTime);
    // TODO: MAKE SURE AIRCRAFTID IS OBJECT ID.

    if (!collections.flights) throw new Error();
    console.log(newFlight);

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

// make sure that I update this to make sense with the flight router
// this is copy and pasted in from the aircraft router
flightsRouter.put("/:id", verifyToken, async (req: Request, res: Response) => {
  // TODO: ensure that ID in params and ID in body are the same. if not, send back 404.
  // const id = req?.params?.id;
  const id = req.body._id;
  const groupId = req.headers["x-group-id"] as string;

  // We need to enforce that id in params matches id in request body.
  try {
    const updatedFlight = req.body as Flight;

    // A hacky way to fix the front end problem <option> changing it to string
    // ALSO WHAT how is NAN working like this ??

    // if (isNaN(updatedFlight.startTime)) {
    //   updatedFlight.startTime = Number(updatedFlight.startTime);
    // } else {
    //   updatedFlight.startTime = Number(updatedFlight.startTime);
    // }

    // if (isNaN(updatedFlight.endTime)) {
    //   updatedFlight.endTime = Number(updatedFlight.endTime);
    // } else {
    //   updatedFlight.endTime = Number(updatedFlight.endTime);
    // }

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
});

flightsRouter.delete(
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
