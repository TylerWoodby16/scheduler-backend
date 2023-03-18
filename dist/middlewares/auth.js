"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        // TODO: DEFINE A TOKEN PAYLOAD TYPE.
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.headers["x-group-id"] = decoded.groupId;
    }
    catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};
exports.verifyToken = verifyToken;
