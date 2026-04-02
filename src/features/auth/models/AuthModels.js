// Matches backend AuthDTO response
export class UserModel {
  constructor(data = {}) {
    this.userId = data.userId ?? null;
    this.email = data.email ?? '';
    this.fullName = data.fullName ?? '';
    this.phone = data.phone ?? null;
    this.status = data.status ?? 'ACTIVE';
    this.roles = data.roles ?? [];
    this.createdAt = data.createdAt ?? null;
  }

  get isAdmin() {
    return this.roles.includes('ROLE_ADMIN');
  }

  get displayName() {
    return this.fullName || this.email;
  }
}

export class LoginRequestModel {
  constructor(data = {}) {
    this.email = data.email ?? '';
    this.password = data.password ?? '';
  }
}

export class RegisterRequestModel {
  constructor(data = {}) {
    this.email = data.email ?? '';
    this.password = data.password ?? '';
    this.fullName = data.fullName ?? '';
    this.phone = data.phone ?? '';
  }
}

// Backend returns tokens in response headers (X-Access-Token, X-Refresh-Token)
// and user data in body
export class AuthResponseModel {
  constructor(data = {}, headers = {}) {
    // Tokens come from response body OR headers
    this.accessToken = data.accessToken ?? headers?.['x-access-token'] ?? '';
    this.refreshToken = data.refreshToken ?? headers?.['x-refresh-token'] ?? '';
    this.user = new UserModel(data);
  }
}
