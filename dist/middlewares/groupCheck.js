"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupOnly = void 0;
const jwt = require("jsonwebtoken");
const groupOnly = (req, res, next) => {
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
        if (groupId == req.body.groupId) {
            next();
        }
        else {
            return res.status(401).send("you dont have groupid");
        }
    }
    catch (err) {
        return res.status(401).send("Invalid Token on group");
    }
};
exports.groupOnly = groupOnly;
