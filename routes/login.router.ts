import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
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

        if(!collections.users) throw new Error();

        const foundUser = await collections.users.findOne({email: loginForm.email});

        console.log(foundUser);

        res.status(200).send("blam");

        // const result = await collections.users.insertOne(newUser);

        // result
        //     ? res.status(201).send(`Successfully created a new user with id ${result.insertedId}`)
        //     : res.status(500).send("Failed to create a new user.");
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});