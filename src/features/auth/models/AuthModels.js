export class UserModel {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.firstName = data.firstName ?? '';
    this.lastName = data.lastName ?? '';
    this.email = data.email ?? '';
    this.role = data.role ?? 'customer';
    this.avatar = data.avatar ?? null;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get isAdmin() {
    return this.role === 'admin';
  }
}

export class LoginRequestModel {
  constructor(data = {}) {
    this.email = data.email ?? '';
    this.password = data.password ?? '';
    this.rememberMe = data.rememberMe ?? false;
  }
}

export class RegisterRequestModel {
  constructor(data = {}) {
    this.firstName = data.firstName ?? '';
    this.lastName = data.lastName ?? '';
    this.email = data.email ?? '';
    this.password = data.password ?? '';
  }
}

export class AuthResponseModel {
  constructor(data = {}) {
    this.accessToken = data.accessToken ?? '';
    this.refreshToken = data.refreshToken ?? '';
    this.user = new UserModel(data.user ?? {});
  }
}
