import { Request, Response, NextFunction } from "express";
import { runInNewContext } from "vm";
const jwt = require("jsonwebtoken");

export const groupOnly = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"];
  console.log(req.body); // so the issue is with the request
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    // TODO: DEFINE A TOKEN PAYLOAD TYPE.
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const groupId = decoded.groupId;
    // doesnt even get here ??
    console.log(groupId);

    // have a funny feeling about req.body.aircraft.groupId
    if (groupId == req.body.aircraft.groupId) {
      next();
    } else {
      return res.status(401).send("you dont have groupid");
    }
  } catch (err) {
    return res.status(401).send("Invalid Token on group");
  }
};
