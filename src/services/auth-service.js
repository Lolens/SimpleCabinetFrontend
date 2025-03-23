import { useAuthStore } from "@/stores/auth";
import RequestService from "./request-service";
import { useRouter } from "vue-router";
import { useBackupAuthStore } from "@/stores/backupAuth";

export default class AuthService {
    static _promiseResolve = null;
    static _promiseFails = null;
    static authWait = new Promise(function(resolve, reject){
        AuthService._promiseResolve = resolve;
        AuthService._promiseReject = reject;
    });
    static authRunned = false;
    static async authorize(login, password, totpCode = '') {
        var authData = await RequestService.request('POST', 'auth/authorize', {
            username: login,
            password: password,
            totpPassword: totpCode
        });
        var store = useAuthStore();
        store.update(null, authData);
        var userData = await AuthService.fetchUserInfo();
        store.update(userData, authData);
    }
    static async register(login, password, email, captcha) {
        var response = await RequestService.request('POST', 'auth/register', {
            username: login,
            password: password,
            email: email,
            captcha: captcha
        })
        return response;
    }


    static async fetchUserInfo() {
        return await RequestService.request('GET', 'auth/userinfo', null);
    }

    static async refreshToken() {
        var store = useAuthStore();
        return await RequestService.request('POST', 'auth/refresh', {
            refreshToken: store.refreshToken
        });
    }

    static async logout() {
        var store = useAuthStore();
        var response = await RequestService.request('POST', 'auth/logout', {});
        store.reset();
    }

    static async authInternal() {
        var store = useAuthStore();
        store.fetchFromStorage();
        if(!store.accessToken) {
            return;
        }
        if(store.isTokenExpired()) {
            var authData = await AuthService.refreshToken();
            store.update(null, authData);
            var userData = await AuthService.fetchUserInfo();
            store.update(userData, authData);
        } else {
            var userData = await AuthService.fetchUserInfo();
            store.update(userData, null);
        }
    }

    static async wait() {
        if(!AuthService.authRunned) {
            AuthService.authRunned = true;
            try {
                await AuthService.authInternal();
            } catch(e) {
                console.log(e);
            }
            AuthService._promiseResolve("1");
        }
        return AuthService.authWait;
    }

    static async requireAuthorize(redirect = false) {
        await AuthService.wait();
        var store = useAuthStore();
        if(store.user == null) {
            if(redirect) {
                var router = useRouter();
                router.push('/auth');
            }
            throw new RequestService("You are not authorized");
        }
    }
}