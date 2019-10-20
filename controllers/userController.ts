import bcrypt = require("bcrypt");
import jwt = require("jwt-simple");

import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import { getJwtSecret } from "../services/JwtService";

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */

/**
 * userController.list()
 */
export const list = async (req: Request, res: Response) => {
  try {
    const dbFilters = userDbFilters(req);
    const user = await User.find(dbFilters, "_id email lastName firstName");
    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when getting Users.",
    });
  }
};

/**
 * userController.show()
 */
export const show = async (req: Request, res: Response) => {
  const id = req.params.id;
  const dbFilters = userDbFilters(req);
  try {
    const user = await User.findOne(Object.assign({ _id: id }, dbFilters));
    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when getting user.",
    });
  }
};

/**
 * userController.create()
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const user = new User({
      email: req.body.email,
      password: await hashedPassword(req.body.password),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    const dbUser = await user.save();
    const response = encodeUserWithJwt(dbUser);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when creating user.",
    });
  }
};

/**
 * userController.update()
 */
export const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const dbFilters = userDbFilters(req);
  try {
    const user = await User.findOne(Object.assign({ id: id }, dbFilters));
    if (user) {
      user.email = req.body.email ? req.body.email : user.email;
      user.password = req.body.password ? await hashedPassword(req.body.password) : user.password;
      user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
      user.lastName = req.body.lastName ? req.body.lastName : user.lastName;
      await user.save();
      res.sendStatus(204);
    } else {
      res.status(404).json({
        message: "user does not exist",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when updating user.",
    });
  }
};

/**
 * userController.remove()
 */
export const remove = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await User.deleteOne({ where: { _id: id } });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      error: error,
      message: "Error when deleting user.",
    });
  }
};

/**
 * userController.login()
 */
export const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const dbUser = await User.findOne({ email });
    if (dbUser) {
      const isMatch = await bcrypt.compare(password, dbUser.password);
      if (isMatch) {
        const response = encodeUserWithJwt(dbUser);
        res.status(201).json(response);
      } else {
        throw new Error("Wrong Password !");
      }
    } else {
      throw new Error("Wrong Email !");
    }
  } catch (error) {
    res.status(500).json({
      error: error,
      message: "Error when login. " + error.message,
    });
  }
};

const userDbFilters = (req: Request) => {
  const filters: any = req.query.filters ? JSON.parse(req.query.filters) : undefined;
  const dbFilters: any = {};
  if (filters) {
    if (filters.email) {
      dbFilters.email = { $regex: ".*" + filters.email + ".*" };
    }
    if (filters.firstName) {
      dbFilters.firstName = { $regex: ".*" + filters.firstName + ".*" };
    }
    if (filters.lastName) {
      dbFilters.lastName = { $regex: ".*" + filters.lastName + ".*" };
    }
  }
  return dbFilters;
};

const hashedPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error(error);
  }
};

function encodeUserWithJwt(dbUser: IUser) {
  const user = {
    firstName: dbUser.firstName,
    lastName: dbUser.lastName,
    email: dbUser.email,
    password: dbUser.password,
    id: dbUser.id,
  };
  const token = jwt.encode(user, getJwtSecret());
  delete user.password;
  const response = {
    token,
    user,
  };
  return response;
}
