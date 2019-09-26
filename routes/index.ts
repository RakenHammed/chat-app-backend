import { Router } from "express";

export const indexRouter = Router();

/* GET home page. */
indexRouter.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});
