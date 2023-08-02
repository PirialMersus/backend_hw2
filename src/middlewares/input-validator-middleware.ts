import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

const checkFunction = (e: any) => ({
  message: e.msg,
    field: e.path
})

export const inputValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next()
  } else {
    res.status(400).json({
      errorsMessages: errors.array().map(checkFunction)
    });
  }
}