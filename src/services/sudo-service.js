import { useAuthStore } from "@/stores/auth";
import { useBackupAuthStore } from "@/stores/backupAuth";
import RequestService from "./request-service";
import { computed } from "vue";

export default class SudoService {
    static async sudo(userId) {
        var store = useAuthStore();
        var backupStore = useBackupAuthStore();
        var response = await RequestService.request('POST', 'admin/session/sudo', {
            userId: userId,
            client: "Web Sudo",
            shadow: true
        })
        if(backupStore.accessToken) {
            SudoService.unsudo();
        }
        backupStore.update(store.user, {
            accessToken: store.accessToken,
            refreshToken: store.refreshToken,
            expire: store.expireDate - Date.now()
        });
        store.reset();
        store.update(null, response);
        var user = await RequestService.request('GET', 'auth/userinfo', null);
        store.update(user, response);
    }
    static async unsudo() { 
        var store = useAuthStore();
        var backupStore = useBackupAuthStore();
        store.update(backupStore.user, {
            accessToken: backupStore.accessToken,
            refreshToken: backupStore.refreshToken,
            expire: backupStore.expireDate - Date.now()
        });
        backupStore.reset();
    }
    static async load() {
        var backupStore = useBackupAuthStore();
        backupStore.fetchFromStorage();
        if(!backupStore.accessToken) {
            return;
        }
    }
}