const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        console.log("Authorization Header:", req.headers.authorization);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. No Token Provided."
            });
        }

        const token = authHeader.split(" ")[1];

        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded Token:", decoded);

        req.user = decoded;

        next();

    } catch (error) {

        console.log("JWT Error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });

    }

};

module.exports = authMiddleware;