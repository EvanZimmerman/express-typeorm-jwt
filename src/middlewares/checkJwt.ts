import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // get the jwt token from the head
  const token = <string>req.headers["auth"];
  let jwtPayload;

  // try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (err) {
    // if token is not valid, respond with 401 (unauthorized)
    res.status(401).send("token is bad");
    return;
  }

  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({userId, username}, config.jwtSecret, {
    expiresIn: "1h"
  });
  res.setHeader("token", newToken);

  // call the next middleware or controller
  next();
};