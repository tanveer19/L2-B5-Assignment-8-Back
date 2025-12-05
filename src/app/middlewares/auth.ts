import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status";
import config from "../config/env";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const auth =
  (...requiredRoles: string[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.accessToken;
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
      }

      const decoded = jwt.verify(token, config.jwt_secret!) as {
        id: string;
        role: string;
      };

      // for routes that have no role restrictions
      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden Access");
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
