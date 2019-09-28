import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import mongoose from "mongoose";
import logger from "morgan";
import path from "path";

import { indexRoutes } from "./routes/index";
import { userRoutes } from "./routes/userRoutes";

export const app: express.Application = express();

// connect to database
mongoose.connect(
  "mongodb://localhost/chat-app",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
).then();

const db = mongoose.connection;
// tslint:disable-next-line: no-console
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  // tslint:disable-next-line: no-console
  console.log("we're connected!");
  // we're connected!
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);
app.use("/api/v1/users", userRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
