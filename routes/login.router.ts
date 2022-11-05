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
        console.log(req.body);

        const loginForm = req.body as LoginForm;

        if(!collections.users) throw new Error();

        const foundUser = await collections.users.findOne({email: loginForm.email});

        if (!foundUser) {
            res.status(404).send("User not found.");
            return;
        }

        res.status(200).send("blam");

    } catch (error: any) {
        res.status(400).send(error.message);
    }
});