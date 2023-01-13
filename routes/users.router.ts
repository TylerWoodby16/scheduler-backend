import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import User from "../models/user";
import bcrypt from "bcrypt";
import { verifyToken } from "../middlewares/auth";

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
    const password = newUser.password;

    // Use bcrypt to encrypt user password.
    let encryptedPasswordUser = newUser;
    encryptedPasswordUser.password = bcrypt.hashSync(password, 10);
    if (!collections.users) throw new Error("No users collection.");

    await collections.users.insertOne(encryptedPasswordUser);
    res
      .status(201)
      .send(`Successfully created a new user with ecrypted password `);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});
