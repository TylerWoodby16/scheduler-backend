import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    // TODO: DEFINE A TOKEN PAYLOAD TYPE.
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.headers["x-user-id"] = decoded.userId;
    req.headers["x-group-id"] = decoded.groupId;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};
