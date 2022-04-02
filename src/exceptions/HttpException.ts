export class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }

  public static badRequest(message?: string) {
    const msg = message || 'Bad Request';
    return new HttpException(400, msg);
  }

  public static unauthorized(message?: string) {
    const msg = message || 'Unauthorized';
    return new HttpException(401, msg);
  }

  public static forbidden(message?: string) {
    const msg = message || 'Forbidden';
    return new HttpException(403, msg);
  }

  public static notFound(message?: string) {
    const msg = message || 'Not Found';
    return new HttpException(404, msg);
  }

  public static conflict(message?: string) {
    const msg = message || 'Conflict';
    return new HttpException(409, msg);
  }

  public static internalServerError(message?: string) {
    const msg = message || 'Internal Server Error';
    return new HttpException(500, msg);
  }

}
