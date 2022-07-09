const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies['access_token'];

    if (!token) {
        return res.status(403).send("Please login to access this api.");
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
