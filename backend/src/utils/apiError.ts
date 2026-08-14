export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(message: string, data?: any): ApiError {
    return new ApiError(400, message, data);
  }

  static unauthorized(message: string, data?: any): ApiError {
    return new ApiError(401, message, data);
  }

  static forbidden(message: string, data?: any): ApiError {
    return new ApiError(403, message, data);
  }

  static notFound(message: string, data?: any): ApiError {
    return new ApiError(404, message, data);
  }

  static conflict(message: string, data?: any): ApiError {
    return new ApiError(409, message, data);
  }

  static internal(message: string, data?: any): ApiError {
    return new ApiError(500, message, data);
  }

  static internalServerError(message: string, data?: any): ApiError {
    return new ApiError(500, message, data);
  }
}
