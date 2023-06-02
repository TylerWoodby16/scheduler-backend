import express, { Request, response, Response } from "express";
import { collections } from "../services/database.service";
import User from "../models/user";
import bcrypt from "bcrypt";
import { verifyToken } from "../middlewares/auth";
import { ObjectId } from "mongodb";
import { runInNewContext } from "vm";

export const usersRouter = express.Router();

usersRouter.use(express.json());

usersRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    if (!collections.users) throw new Error();
    const groupId = req.headers["x-group-id"] as string;

    const users = await collections.users
      .find({ groupId: new ObjectId(groupId), role: "Student" })
      .toArray();

    res.status(200).send(users);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

usersRouter.get("/cfis", verifyToken, async (req: Request, res: Response) => {
  try {
    if (!collections.users) throw new Error();
    const groupId = req.headers["x-group-id"] as string;

    const users = await collections.users
      .find({ groupId: new ObjectId(groupId), roles: "CFI" })
      .toArray();

    res.status(200).send(users);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// Getting one User
usersRouter.get("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    if (!collections.users) throw new Error();
    const id = req.params.id;
    const groupId = req.headers["x-group-id"] as string;

    const users = await collections.users.findOne({
      _id: new ObjectId(id),
      groupId: new ObjectId(groupId),
    });

    res.status(200).send(users);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

//literally the copied code from the get"/"" but this one causes a 500 error ??
usersRouter.get(
  "/students",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      if (!collections.users) throw new Error();
      const groupId = req.headers["x-group-id"] as string;

      const users = await collections.users
        .find({ groupId: new ObjectId(groupId), role: "Student" })
        .toArray();

      res.status(200).send(users);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

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
      roles: ["Admin"],
    };

    await collections.users.insertOne(completeUser);

    res
      .status(201)
      .send(`Successfully created a new user with ecrypted password `);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

usersRouter.put("/:id", verifyToken, async (req: Request, res: Response) => {
  let id = req.body._id;
  const groupId = req.headers["x-group-id"] as string;

  try {
    let user = req.body as User;
    const query = {
      _id: new ObjectId(id),
      groupId: new ObjectId(groupId),
    };

    // Enforce that URL params and request body ID match.
    if (id !== req.params.id) {
      res.status(400).send("Param Id does not match req body Id");
      return;
    }

    if (!collections.users) throw new Error("No users collection.");

    // TODO: WHY DO WE HAVE TO DO THIS??
    user._id = new ObjectId(user._id);
    user.groupId = new ObjectId(user.groupId);

    let updateResult = await collections.users.findOneAndReplace(query, user);
    console.log(updateResult);

    updateResult
      ? res.status(200).send(`Successfully updated user with id ${id}`)
      : res.status(404).send(`User with id: ${id} not found`);
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
