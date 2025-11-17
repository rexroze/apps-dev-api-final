import express from "express";
import cors from "cors";
import routes from "@/routes";
import passport from "passport";
import { initializePassport } from "@/services/auth/passport";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use("/api", routes);