const admin = require("../config/firebase");

const decodeToken = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({ message: "Unauthorized: Missing Authorization Header" });
        }

        const [bearer, token] = authorizationHeader.split(" ");

        if (bearer !== "Bearer" || !token) {
            return res.status(401).json({ message: "Unauthorized: Invalid Authorization Header" });
        }

        const decodeValue = await admin.auth().verifyIdToken(token);

        if (decodeValue) {
            // if the token is valid uid is paesed with the req object
            req.uid = decodeValue.uid;
            return next();
        } else {
            res.status(401).json({ message: "You are not authorized" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Error" });
    }
};

module.exports = decodeToken;
