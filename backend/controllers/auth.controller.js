import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessfulEmail,
} from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required.");
    }

    const userAlreadyExists = await User.findOne({ email }); //check the provided email if its exist and returns true otherwise false
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exist" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10); //hash password, 10 means 10 times the hashing algorithm will applied
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString(); // generates a random 6-digit number as a string, the smallest value is 100,000 and max value is 999,999

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 represents 24 hrs (1 day), 60 no. of minutes in an hour, 60 no. of seconds in minute and 1000 in milliseconds in a second, Multiplying these values gives 86,400,000 milliseconds, which is equivalent to 24 hours.
    });

    await user.save(); //update the database

    // jwt
    generateTokenAndSetCookie(res, user._id); // generates token

    // mailtrap
    await sendVerificationEmail(user.email, verificationToken); //sends verification email function

    res.status(201).json({
      success: true,
      msg: "User created successfully",
      user: {
        ...user._doc, // spread the user document
        password: undefined, // and make the user undefined because we don't want the password to be sent to the client
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }, // $gt or greater than is an operator in mongodb/mongoose
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid or expired verification code" });
    }

    user.isVerified = true; // update the isVerified in the database
    user.verificationToken = undefined; // update the verification token in the database by deleting the value after it's verified
    user.verificationTokenExpiresAt = undefined; // update the verification token expire in the database by deleting the value it's verified
    await user.save();

    await sendWelcomeEmail(user.email, user.name); // send a welcome email in gmail
    res.status(200).json({
      success: true,
      msg: "Email verified",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("error in verifyEmail", error);
    return res.status(400).json({ success: false, msg: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password); // securely compare a plain text password with a hashed password stored in a database and return true or false
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      msg: "Logged in successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.status(400).json({ success: false, msg: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token"); // removes the specified cookie (in this case, the "token" cookie) by sending a response header that tells the browser to delete the cookie.
  res.status(200).json({ success: true, msg: "Logout successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }

    //Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex"); // The resetToken is meant to serve as a unique, secure, and temporary identifier that will be sent to the user via email. It will allow the user to reset their password after clicking a link that includes this token.
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // resetTokenExpiresAt stores the time when the reset token should no longer be valid. This is crucial for security, as it ensures that users can't use an old reset token after a certain period (in this case, 1 hour).

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    user.save();

    //send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res
      .status(200)
      .json({ success: true, msg: "Password reset link sent to your email" });
  } catch (error) {
    console.log("Error in forgotPassword: ", error);
    res.status(200).json({ success: true, msg: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid or expired reset token" });
    }

    //update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessfulEmail(user.email);

    res.status(200).json({ success: true, msg: "Password reset successful" });
  } catch (error) {
    console.log("Error: ", error.message);
    res.status(400).json({ success: false, msg: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(400).json({ success: false, smg: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    console.log("Error in checkAuth: ", error);
    res.status(400).json({ success: false, msg: error.message})
  }
};
