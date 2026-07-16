import { Response } from 'express';

interface ApiResponsePayload {
  success: boolean;
  message: string;
  data?: any;
}

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: any
): Response => {
  const payload: ApiResponsePayload = {
    success,
    message,
  };

  if (data) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: any
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};
