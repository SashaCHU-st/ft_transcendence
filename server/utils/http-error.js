class HttpError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export default HttpError;

