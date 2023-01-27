import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";

interface LoginForm {
  email: string;
  password: string;
}

export const loginRouter = express.Router();

loginRouter.use(express.json());

loginRouter.post("/", async (req: Request, res: Response) => {
  try {
    const loginForm = req.body as LoginForm;

    if (!collections.users) throw new Error();

    // Determine if user exists by looking them up by email.
    const foundUser = await collections.users.findOne({
      email: loginForm.email,
    });

    if (!foundUser) {
      res.status(404).send("User not found.");
      return;
    }

    // Compare password from login form with found user's password.
    const isValidPassword = bcrypt.compareSync(
      loginForm.password,
      foundUser.password
    );
    if (isValidPassword) {
      const token = jwt.sign(
        {
          userId: foundUser._id,
          userRole: foundUser.role,
        },
        process.env.TOKEN_KEY!,
        {
          expiresIn: "2h",
        }
      );

      res.status(200).send({ token: token });
    } else {
      res.status(401).send("Password incorrect.");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});
