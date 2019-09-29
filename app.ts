import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import mongoose from "mongoose";
import logger from "morgan";
import path from "path";

import { indexRoutes } from "./routes/index";
import { messageRoutes } from "./routes/messageRoutes";
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

app.use((req, res, next) => {
  // to delete
  // http://stackoverflow.com/questions/9310112/why-am-i-seeing-an-origin-is-not-allowed-by-access-control-allow-origin-error
  // http://stackoverflow.com/questions/23469747/access-control-origin-not-allowed
  // http://stackoverflow.com/questions/30224928/setting-access-control-allow-origin-doesnt-work-with-ajax-node-js
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cache-Control, X-Requested-With");
  res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "sameorigin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  // res.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' https://cdnjs.cloudflare.com");
  // res.setHeader("Access-Control-Allow-Credentials", true);
  // end of to delete
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/messages", messageRoutes);

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
