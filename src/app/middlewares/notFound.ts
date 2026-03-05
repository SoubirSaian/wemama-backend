import { NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res
    .status(404)
    .json({ success: false, message: 'Api Not found', error: '' });
};

export default notFound;
