export class ApiResponse {
  constructor(data, status, headers) {
    this.data = data;
    this.status = status;
    this.headers = headers;
  }
}

export class ApiError {
  constructor(message, status, data, type) {
    this.message = message;
    this.status = status;
    this.data = data;
    this.type = type;
  }
}
