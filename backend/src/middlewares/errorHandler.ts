import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { ValidationError } from "sequelize";

class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof ValidationError) {
    statusCode = 400;
    message = err.errors[0]?.message || "Validation error";
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (env.NODE_ENV === "development") {
    res.status(statusCode).json({ success: false, message, stack: err.stack });
  } else {
    res.status(statusCode).json({ success: false, message });
  }
};

export { AppError, errorHandler };
