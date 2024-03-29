import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import Aircraft, { AirworthinessDirective } from "../models/aircraft";
import { verifyToken } from "../middlewares/auth";
import { ObjectId } from "mongodb";
import { adminOnly } from "../middlewares/adminCheck";

export const aircraftsRouter = express.Router();

aircraftsRouter.use(express.json());

aircraftsRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    if (!collections.aircrafts) throw new Error();

    const groupId = req.headers["x-group-id"] as string;

    const aircrafts = await collections.aircrafts
      .find({ groupId: new ObjectId(groupId) })
      .toArray();

    res.status(200).send(aircrafts);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

aircraftsRouter.get(
  "/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      if (!collections.aircrafts) throw new Error();
      const id = req.params.id;
      const groupId = req.headers["x-group-id"] as string;

      const aircraft = await collections.aircrafts.findOne({
        _id: new ObjectId(id),
        groupId: new ObjectId(groupId),
      });

      res.status(200).send(aircraft);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

aircraftsRouter.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const newAircraft = req.body as Aircraft;
    newAircraft._id = new ObjectId();
    const groupId = req.headers["x-group-id"] as string;
    newAircraft.groupId = new ObjectId(groupId);

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

// make new endpoint wiht new /name
// keep group id
// add ad (that we got from the request) to the current ad array of the aircraft
// update the aircraft
// respond with proper status code
aircraftsRouter.put(
  "/updateAD/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    if (!collections.aircrafts) throw new Error();
    const groupId = req.headers["x-group-id"] as string;

    const newAD = req.body as AirworthinessDirective;

    const id = req.params.id;

    try {
      const aircraft = await collections.aircrafts.findOne({
        groupId: new ObjectId(groupId),
        _id: new ObjectId(id),
      });

      // TODO: TEMPORARY. NEED PROPER ERROR HANDLING IF AIRCRAFT NOT FOUND.

      if (aircraft == null) throw new Error();

      let newADs = aircraft.airworthinessDirectives;
      if (newADs == null) {
        newADs = [];
      }

      newADs.push(newAD);

      const query = { _id: aircraft._id, groupId: new ObjectId(groupId) };
      const result = await collections.aircrafts.updateOne(query, {
        $set: {
          airworthinessDirectives: newADs,
        },
      });

      result
        ? res.status(201).send(
            //?
            `Successfully created a new AD field`
          )
        : res.status(500).send("Failed to create a new AD field.");
    } catch (err) {
      console.log(err);
      res.status(500).send("catch error for adding AD");
    }
  }
);

aircraftsRouter.put(
  "/bruteUpsert",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      // make variable with mongo query to findall aircraft names
      // if statement comparing the newAircraft name against the variable we just made
      // if it matches update
      // if it does not match insert

      // if the request body (the aircraft) contains an ID -> update
      // if the request body doesn't contain an ID -> insert

      if (!collections.aircrafts) throw new Error();
      const groupId = req.headers["x-group-id"] as string;

      // const aircrafts = await collections.aircrafts; why did we rename it here ?

      const allAircrafts = await collections.aircrafts
        .find({ groupId: new ObjectId(groupId) })
        .toArray();

      let ticker = false;

      const newAircraft = req.body as Aircraft;

      allAircrafts.forEach((aircraft) => {
        if (aircraft.name == newAircraft.name) {
          ticker = true;
        }
      });

      if (ticker) {
        const query = { name: newAircraft.name };
        const result = await collections.aircrafts.updateOne(query, {
          $set: {
            year: newAircraft.year,
          },
        });

        // respond with status code
        result
          ? res.status(201).send(
              //?
              `Successfully created a new aircraft with id`
            )
          : res.status(500).send("Failed to create a new aircraft.");
      } else {
        // the standard insert
        const result = await collections.aircrafts.insertOne(newAircraft);

        result
          ? res.status(201).send(
              //?
              `Successfully created a new aircraft with id ${result.insertedId}`
            )
          : res.status(500).send("Failed to create a new aircraft.");
      }
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }
);

aircraftsRouter.put(
  "/gentleUpsert",
  verifyToken,
  adminOnly,
  // groupOnly,
  async (req: Request, res: Response) => {
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

    if (!collections.aircrafts) throw new Error();

    let newAircraft = req.body as Aircraft;

    const groupId = req.headers["x-group-id"] as string;

    // i beleive we will need to get the group id here, and add a second param to the search
    //newAircraft.groupId = new ObjectId(groupId);

    if (newAircraft._id.toString() != "") {
      try {
        const query = {
          _id: new ObjectId(newAircraft._id),
          groupId: new ObjectId(groupId),
        };

        //if name exists, then update the year.
        const result = await collections.aircrafts.updateOne(query, {
          $set: { year: newAircraft.year },
        });

        // in update case, also make sure to respond with the correct status code.
        result
          ? res.status(200).send(`Successfully created a new aircraft with id`)
          : res.status(500).send("Failed to create a new aircraft.");
      } catch (error) {
        res.status(500).send("Failed to update aircraft.");
      }
    } else {
      //the standard insert
      try {
        const groupId = req.headers["x-group-id"] as string;

        // newAircraft._id = new ObjectId(groupId);
        newAircraft.groupId = new ObjectId(groupId);

        // this is where the problem lies ??? maybe not

        const result = await collections.aircrafts.insertOne(newAircraft);
        result
          ? res
              .status(201)
              .send(
                `Successfully created a new aircraft with id ${result.insertedId}`
              )
          : res.status(500).send("Failed to create a new aircraft.");
      } catch (error) {
        res.status(500).send("Failed to create new aircraft.");
      }
    }
  }
);

aircraftsRouter.put(
  "/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    const id = req?.params?.id;
    const groupId = req.headers["x-group-id"] as string;

    // We need to enforce that id in params matches id in request body.
    try {
      const updatedAircraft = req.body as Aircraft;

      const query = {
        _id: new ObjectId(id),
        groupId: new ObjectId(groupId),
      };

      if (!collections.aircrafts) throw new Error();

      // TODO: WHY DO WE HAVE TO DO THIS??
      updatedAircraft._id = new ObjectId(updatedAircraft._id);
      updatedAircraft.groupId = new ObjectId(updatedAircraft.groupId);

      const result = await collections.aircrafts.findOneAndReplace(
        query,
        updatedAircraft
      );

      result
        ? res.status(200).send(`Successfully updated aircraft with id ${id}`)
        : res.status(304).send(`Aircraft with id: ${id} not updated`);
    } catch (error: any) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
);

aircraftsRouter.put(
  "/updateMany/:name/:more/:stuff",
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

aircraftsRouter.delete(
  "/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const groupId = req.headers["x-group-id"] as string;

    if (!collections.aircrafts) throw new Error();

    const query = { _id: new ObjectId(id), groupId: new ObjectId(groupId) };

    const result = await collections.aircrafts.deleteOne(query);

    try {
      if (result && result.deletedCount) {
        res.status(202).send(`Successfully removed game with id `);
      } else if (!result) {
        res.status(400).send(`Failed to remove game with id `);
      } else if (!result.deletedCount) {
        res.status(404).send(`Aircraft with id does not exist`);
      }
    } catch (error: any) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
);

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
