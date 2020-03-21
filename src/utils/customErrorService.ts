export class CustomErrorService extends Error {
  metadata: any;

  constructor(message: string, metadata: object = {}) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    this.metadata = metadata;
  }
}
