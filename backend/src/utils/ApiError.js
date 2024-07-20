class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", error = []) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.error = error;
  }
}

module.exports = ApiError;
