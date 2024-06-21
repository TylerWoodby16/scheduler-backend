import express, { Request, response, Response } from "express";
import { collections } from "../services/database.service";
import User from "../models/user";

import { verifyToken } from "../middlewares/auth";
import { ObjectId } from "mongodb";
import Lesson from "../models/lesson";

export const lessonsRouter = express.Router();

lessonsRouter.use(express.json());

lessonsRouter.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const newLesson = req.body as Lesson;
    newLesson._id = new ObjectId();
    const groupId = req.headers["x-group-id"] as string;
    newLesson.groupId = new ObjectId(groupId);

    if (!collections.lessons) throw new Error("No lessons collection.");

    await collections.lessons.insertOne(newLesson);

    res.status(201).send(`Successfully created a new lesson `);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

lessonsRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    if (!collections.lessons) throw new Error();

    const groupId = req.headers["x-group-id"] as string;

    const lessons = await collections.lessons
      // .find({ groupId: new ObjectId(groupId) })
      .find()
      .toArray();
    console.log(lessons);

    res.status(200).send(lessons);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

//TODO: make a get route with a specific id

lessonsRouter.get("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    if (!collections.aircrafts) throw new Error();
    const id = req.params.id;
    const groupId = req.headers["x-group-id"] as string;

    const lesson = await collections.lessons?.findOne({
      _id: new ObjectId(id),
    });

    res.status(200).send(lesson);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

lessonsRouter.delete(
  "/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const groupId = req.headers["x-group-id"] as string;

    if (!collections.lessons) throw new Error();
    // TODO: bring back the groupID HAHHA
    // const query = { _id: new ObjectId(id), groupId: new ObjectId(groupId) };

    const query = { _id: new ObjectId(id) };

    const result = await collections.lessons.deleteOne(query);

    try {
      if (result && result.deletedCount) {
        res.status(202).send(`Successfully removed lesson with id `);
      } else if (!result) {
        res.status(400).send(`Failed to remove lesson with id `);
      } else if (!result.deletedCount) {
        res.status(404).send(`Lesson with id does not exist`);
      }
    } catch (error: any) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
);
