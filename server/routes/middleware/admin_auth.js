const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const express = require('express');
const app = express();
app.use(cookieParser());


const verifyToken = (req, res, next) => {
    const token = req.cookies?.['access_token_admin'];

    if (!token) {
        return res.status(403).send("Sorry, Only admins are allowed to access this api.");
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;
