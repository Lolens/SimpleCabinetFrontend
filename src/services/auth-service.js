import { useAuthStore } from "@/stores/auth";
import RequestService from "./request-service";

export default class AuthService {
  static _authPromise = null;
  static _authResolved = false;
  static _authPromiseResolve = null;

  // Упрощенный промис для ожидания аутентификации
  static get authWait() {
    if (!this._authPromise) {
      this._authPromise = new Promise((resolve) => {
        this._authPromiseResolve = resolve;
      });
    }
    return this._authPromise;
  }

  static async authorize(login, password, totpCode = "") {
    try {
      const authData = await RequestService.request("POST", "auth/authorize", {
        username: login,
        password: password,
        totpPassword: totpCode,
      });
      
      const store = useAuthStore();
      // Обновляем токены
      store.update(null, authData);
      
      // Немедленно получаем информацию о пользователе
      const userData = await this.fetchUserInfo();
      store.update(userData, authData);
      
      // Разрешаем промис, если он еще не разрешен
      if (this._authPromiseResolve && !this._authResolved) {
        this._authResolved = true;
        this._authPromiseResolve();
      }
      
      return userData;
    } catch (error) {
      throw error;
    }
  }

  static async authInternal() {
    const store = useAuthStore();
    store.fetchFromStorage();
    
    if (!store.accessToken) {
      // Если нет токена, все равно разрешаем промис
      if (this._authPromiseResolve && !this._authResolved) {
        this._authResolved = true;
        this._authPromiseResolve();
      }
      return;
    }
    
    try {
      if (store.isTokenExpired()) {
        const authData = await this.refreshToken();
        store.update(null, authData);
        const userData = await this.fetchUserInfo();
        store.update(userData, authData);
      } else {
        const userData = await this.fetchUserInfo();
        store.update(userData, null);
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      store.reset();
    } finally {
      // Всегда разрешаем промис после попытки восстановления сессии
      if (this._authPromiseResolve && !this._authResolved) {
        this._authResolved = true;
        this._authPromiseResolve();
      }
    }
  }

  static async wait() {
    // Если аутентификация уже запущена, ждем существующий промис
    if (!this._authPromise) {
      this._authPromise = new Promise((resolve) => {
        this._authPromiseResolve = resolve;
      });
      await this.authInternal();
    }
    
    return this._authPromise;
  }

  // Остальные методы остаются без изменений
  static async register(login, password, email, captcha) {
    const response = await RequestService.request("POST", "auth/register", {
      username: login,
      password: password,
      email: email,
      captcha: captcha,
    });
    return response;
  }

  static async fetchUserInfo() {
    const response = await RequestService.request("GET", "auth/userinfo", null);

    return {
    id: response.id,
    username: response.username,
    uuid: response.uuid,
    gender: response.gender,
    reputation: response.reputation,
    status: response.status,
    registrationDate: response.registrationDate,
    groups: response.groups || [],
    assets: response.textures || {} 
  };
  }

  static async refreshToken() {
    const store = useAuthStore();
    return await RequestService.request("POST", "auth/refresh", {
      refreshToken: store.refreshToken,
    });
  }

  static async logout() {
    const store = useAuthStore();
    try {
      await RequestService.request("POST", "auth/logout", {});
    } finally {
      store.reset();
      // Сбрасываем состояние аутентификации
      this._authPromise = null;
      this._authResolved = false;
      this._authPromiseResolve = null;
    }
  }

  static async requireAuthorize(redirect = false) {
    await this.wait();
    const store = useAuthStore();
    if (store.user == null) {
      if (redirect) {
        const router = useRouter();
        router.push("/auth");
      }
      throw new Error("You are not authorized");
    }
  }
}