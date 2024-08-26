import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.mjs";

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

    const token = generateToken(user.id);

    // Create a cookie and send to user
    return res
      .cookie("token", token, {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      });
  } catch (err) {
    console.log("Error logging user: ", err);
    return res
      .status(500)
      .json({ success: false, error: "Error logging user" });
  }
};

export const getUserInfo = async (req, res) => {
  if (req.cookies && req.cookies.token) {
    try {
      jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET_KEY,
        async (err, payload) => {
          if (err) {
            return res
              .status(401)
              .json({ success: false, message: "Not authorized" });
          }
          const id = payload.id;
          const user = await prisma.user.findUnique({
            where: {
              id,
            },
          });
          const token = generateToken(id);

          return res
            .cookie("token", token, {
              httpOnly: false,
              maxAge: 1000 * 60 * 60 * 24 * 7,
            })
            .status(200)
            .json({
              success: true,
              message: "User logged in successfully",
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
              },
            });
        }
      );
    } catch (err) {
      console.log("Token not found. Login using username and password");
    }
  }
};

export const logout = (req, res) => {
  return res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};
