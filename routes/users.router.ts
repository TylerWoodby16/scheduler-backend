import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import User from "../models/user";
import bcrypt from "bcrypt";

export const usersRouter = express.Router();

usersRouter.use(express.json());

usersRouter.get("/", async (_req: Request, res: Response) => {
  try {
    if (!collections.users) throw new Error();

    const users = await collections.users.find({}).toArray();

    res.status(200).send(users);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

usersRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newUser = req.body as User;
    const password = newUser.password;

    bcrypt.hash(password, 10).then(function (hash) {
      let encryptedPasswordUser = newUser;
      encryptedPasswordUser.password = hash;

      if (!collections.users) throw new Error("No users collection.");

      collections.users
        .insertOne(encryptedPasswordUser)
        .then(function (result) {
          result
            ? res
                .status(201)
                .send(
                  `Successfully created a new user with id ${result.insertedId}`
                )
            : res.status(500).send("Failed to create a new user.");
        });
    });
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});
