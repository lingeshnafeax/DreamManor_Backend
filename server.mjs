import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./Routes/authRoute.mjs";
import cors from "cors";

dotenv.config();
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

// Auth routes
app.use("/api/auth", authRouter);
