import { Router } from "express";
import jwt = require("jwt-simple");
import User from "../models/User";
import { getJwtSecret } from "../services/JwtService";

export const indexRoutes = Router();

indexRoutes.use("/", async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  const authorization = req.headers.authorization;
  if (
    !req.url.startsWith("/api/v1/users/login")
    && !req.url.startsWith("/api/v1/users/signup")
  ) {
    try {
      if (authorization && authorization.length > 10) {
        if (typeof authorization !== "string") {
          throw new Error("typeof authorization");
        }
        const token = authorization.substring(7);
        const decoded = jwt.decode(token, getJwtSecret());
        const user = await User.findOne({ _id: decoded._id });
        if (!user) {
          throw new Error("unauthorized");
        }
        req.user = user;
        return next();
      } else {
        throw new Error();
      }
    } catch (error) {
      res.status(401).json({
        message: "not logged in",
      });
    }
  }
  return next();
});
