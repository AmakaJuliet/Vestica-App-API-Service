const jwt = require("jsonwebtoken");

function verifyAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.json({
            message: "access_token missing",
            success: false,
        });
    }
    const token = authHeader.split(" ")[1];

    const isValidAccessToken = jwt.verify(token, process.env.JWT_SECRET);

    if(!isValidAccessToken) {
        return res.json({
            message: "invalid or expired access_token",
            success: false,
        });
    }

    req.user = isValidAccessToken;
    next();
};

module.exports = verifyAuth;