"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
const jwt = require("jsonwebtoken");
const adminOnly = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        // TODO: DEFINE A TOKEN PAYLOAD TYPE.
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        const userRole = decoded.userRole;
        if (userRole == "Admin") {
            next();
        }
        else {
            return res.status(401).send("you dont have permission");
        }
    }
    catch (err) {
        return res.status(401).send("Invalid Token");
    }
};
exports.adminOnly = adminOnly;
