import { CustomError } from "./interfaces.js";

export class HTTPError extends Error implements CustomError {
  constructor(
    public statusCode: number,
    public statusMessage: string,
    public message: string
  ) {
    super(message);
    this.name = 'HTTPError';
  }
}
