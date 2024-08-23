import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./Routes/authRoute.mjs";

dotenv.config();

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});


// Auth routes
app.use("/api/auth", authRouter);
