class HTTPError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

class InvalidDataError extends Error {
  constructor(message) {
    super(message);
  }
}

export { HTTPError, InvalidDataError };