class CustomErrorService extends Error {
  metadata: Object;

  constructor(message: string, metadata: Object = {}) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    this.metadata = metadata;
  }
}

module.exports = CustomErrorService;
