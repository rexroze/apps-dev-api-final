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

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      products: "/api/product",
      categories: "/api/category",
      cart: "/api/cart",
      checkout: "/api/checkout",
      orders: "/api/orders",
      reviews: "/api/review"
    }
  });
});

app.use("/api", routes);