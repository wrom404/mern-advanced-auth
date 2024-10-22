import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {    // generates token
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript, enhancing security by protecting it from XSS (Cross-Site Scripting) attacks.
    secure: process.env.NODE_ENV === "production", // Ensures the cookie is only sent over HTTPS connections when in production mode. This prevents cookie theft over unsecured connections.
    sameSite: "strict", // Restricts the cookie to be sent only to the same site that set it, preventing CSRF (Cross-Site Request Forgery) attacks.
    maxAge: 7 * 24 * 60 * 60 * 1000, // Sets the cookie to expire in 7 days (7 days converted to milliseconds).
  });

  return token;
};
