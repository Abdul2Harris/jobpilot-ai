import type { Request, Response, NextFunction } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export const catchAsync = (...fns: AsyncHandler[]) => {
  return fns.map(
    (fn) => (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next);
    }
  );
};