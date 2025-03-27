const admin = require("firebase-admin");

const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Access Denied: No token provided");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(400).send("Invalid or expired token");
  }
};

module.exports = auth;
