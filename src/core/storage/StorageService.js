export class StorageService {
  static REFRESH_TOKEN = 'REFRESH_TOKEN';
  static ACCESS_TOKEN = 'ACCESS_TOKEN';
  static USER = 'USER';

  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static get(key) {
    const value = localStorage.getItem(key);

    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return value;
    }
  }

  static remove(key) {
    localStorage.removeItem(key);
  }

  static setAccessToken(token) {
    this.set(this.ACCESS_TOKEN, token);
  }

  static getAccessToken() {
    return this.get(this.ACCESS_TOKEN);
  }

  static setRefreshToken(token) {
    this.set(this.REFRESH_TOKEN, token);
  }

  static getRefreshToken() {
    return this.get(this.REFRESH_TOKEN);
  }

  static clearStorage() {
    localStorage.clear();
  }
}
