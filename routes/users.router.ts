import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import User from "../models/user";
import bcrypt from "bcrypt";
import { verifyToken } from "../middlewares/auth";
import Group from "../models/group";
import { ObjectId } from "mongodb";

export const usersRouter = express.Router();

usersRouter.use(express.json());

usersRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    if (!collections.users) throw new Error();

    const userId = req.headers["X-USER-ID"];

    const users = await collections.users.find({}).toArray();

    res.status(200).send(users);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

usersRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newUser = req.body as User;

    if (!collections.users) throw new Error("No users collection.");
    if (!collections.groups) throw new Error("No groups collection.");

    const group = { _id: new ObjectId(), name: "mga" }; // TODO: DON'T HARDCODE NAME IN THE FUTURE.
    // TODO: MAYBE CHECK THE RESULT OF THESE TWO DATABASE OPERATIONS.

    // TODO: set up these two operations in a TRANSACTION.
    // open the database connection
    // queue up operation one
    // queue up operation two
    // queue up operation ...
    // perform ALL operations
    // if all succeed -> success
    // if ANY fail -> failure
    // -- if there is a failure, ALL of the previous operations will be ROLLED BACK.

    await collections.groups.insertOne(group);

    const completeUser: User = {
      _id: new ObjectId(),
      email: newUser.email,
      password: bcrypt.hashSync(newUser.password, 10), // Use bcrypt to encrypt user password.
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      groupId: group._id,
      role: "Admin",
    };

    await collections.users.insertOne(completeUser);

    res
      .status(201)
      .send(`Successfully created a new user with ecrypted password `);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});
