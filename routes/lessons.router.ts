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
    console.log(res);

    if (!collections.lessons) throw new Error("No lessons collection.");
    // if (!collections.groups) throw new Error("No groups collection.");

    // const group = { _id: new ObjectId(), name: "mga" };

    // await collections.groups.insertOne(group);

    //TODO: find out how to post the info that was posted as opposed to the hardcoded version

    const completeLesson: Lesson = {
      sections: ["wtf"],
    };
    console.log(completeLesson);

    await collections.lessons.insertOne(completeLesson);

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
    console.log("was here");

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
