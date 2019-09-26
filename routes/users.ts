import { Router } from "express";

export const userRouter = Router();

/* GET users listing. */
userRouter.get("/", (req, res, next) => {
  res.send("respond with a resource");
});
