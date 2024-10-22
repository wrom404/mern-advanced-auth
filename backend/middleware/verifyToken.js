import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; //get the token (it requires cookieParser() middleware to work, see server.js)
  if (!token)
    return res
      .status(401)
      .json({ success: false, msg: "Unauthorized - no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // verify and decode a JSON Web Token (JWT) by the use of the same JWT_SECRET that use to generate a jwt

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized - no token provided" });
    }

    req.userId = decoded.userId; // The middleware attaches the userId from the decoded token to the request object (req). This allows the next middleware or route handler to access req.userId and know which user is making the request.
    next();
  } catch (error) {
    console.log("Error in verifyToken: ", error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
