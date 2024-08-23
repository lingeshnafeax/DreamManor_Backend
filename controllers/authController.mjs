import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });
  }
  try {
    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });
    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.log("Error creating user: ", err);
    // If the user is already in the database
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "Username or email already exists",
      });
    }
    return res
      .status(500)
      .json({ success: false, error: "Error creating user" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });
  }
  try {
    // Checking if the user is present
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Comparing the user password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid password" });
    }
    // Generate JWT

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    // Create a cookie and send to user
    return res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .status(200)
      .json({ success: true, message: "User logged in successfully" });
  } catch (err) {
    console.log("Error logging user: ", err);
    return res
      .status(500)
      .json({ success: false, error: "Error logging user" });
  }
};

export const logout = (req, res) => {
  return res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};
