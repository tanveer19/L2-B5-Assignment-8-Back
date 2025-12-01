import { Response } from "express";

interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export const sendResponse = <T>(res: Response, payload: IResponse<T>) => {
  const responsePayload: IResponse<T> = {
    statusCode: payload.statusCode,
    success: payload.success,
    message: payload.message,
    data: payload.data,
    meta: payload.meta,
  };

  return res.status(payload.statusCode).json(responsePayload);
};
