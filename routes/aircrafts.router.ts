import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import Aircraft from "../models/aircraft";
import { verifyToken } from "../middlewares/auth";
import { ObjectId } from "mongodb";

export const aircraftsRouter = express.Router();

aircraftsRouter.use(express.json());

aircraftsRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    if (!collections.aircrafts) throw new Error();

    const userId = req.headers["x-user-id"] as string;

    const aircrafts = await collections.aircrafts
      .find({ userId: new ObjectId(userId) })
      .toArray();

    res.status(200).send(aircrafts);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

aircraftsRouter.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const newAircraft = req.body as Aircraft;
    const userId = req.headers["x-user-id"] as string;
    newAircraft.userId = new ObjectId(userId);

    if (!collections.aircrafts) throw new Error();

    const result = await collections.aircrafts.insertOne(newAircraft);

    result
      ? res
          .status(201)
          .send(
            `Successfully created a new aircraft with id ${result.insertedId}`
          )
      : res.status(500).send("Failed to create a new aircraft.");
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

aircraftsRouter.put("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;

  // We need to enforce that id in params matches id in request body.

  try {
    const updatedAircraft = req.body as Aircraft;
    const query = { _id: updatedAircraft._id };

    // $set adds or updates all fields
    if (!collections.aircrafts) throw new Error();
    const result = await collections.aircrafts.updateOne(query, {
      $set: updatedAircraft,
    });

    result
      ? res.status(200).send(`Successfully updated game with id ${id}`)
      : res.status(304).send(`Game with id: ${id} not updated`);
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});

aircraftsRouter.put(
  "/updateMany/:name",
  async (req: Request, res: Response) => {
    const name = req?.params?.name;

    // We need to enforce that id in params matches id in request body.

    try {
      const update = req.body as Aircraft;
      const query = { name: name };

      // $set adds or updates all fields
      if (!collections.aircrafts) throw new Error();
      const result = await collections.aircrafts.updateMany(query, {
        $set: { year: update.year },
      });
      // updating aircraft by req.body on line 65 could cause issues
      result
        ? res.status(200).send(`Successfully updated`)
        : res.status(304).send(`not updated`);
    } catch (error: any) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
);

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

aircraftsRouter.delete(
  "/deleteMany/:name",
  async (req: Request, res: Response) => {
    const name = req?.params?.name;

    try {
      const query = { name: name };
      if (!collections.aircrafts) throw new Error();
      const result = await collections.aircrafts.deleteMany(query);

      if (result && result.deletedCount) {
        res.status(202).send(`Successfully removed with names ${name}`);
      } else if (!result) {
        res.status(400).send(`Failed to remove with name ${name}`);
      } else if (!result.deletedCount) {
        res.status(404).send(`Airplane with name ${name} does not exist`);
      }
    } catch (error: any) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
);
