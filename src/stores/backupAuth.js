import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import RequestService from '@/services/request-service';

export const useBackupAuthStore = defineStore('backupAuth', () => {
  const user = ref(null);
  const accessToken = ref(null);
  const refreshToken = ref(null);
  const expireDate = ref(null);
  function update(userData, authData) {
    if(userData) {
      user.value = userData;
    }
    if(authData) {
      accessToken.value = authData.accessToken;
      refreshToken.value = authData.refreshToken;
      expireDate.value = Date.now() + authData.expire;
      localStorage.setItem('secondaryAccessToken', accessToken.value);
      localStorage.setItem('secondaryRefreshToken', refreshToken.value);
      localStorage.setItem('secondaryExpireToken', expireDate.value);
    }
  }
  function fetchFromStorage() {
    accessToken.value = localStorage.getItem('secondaryAccessToken');
    refreshToken.value = localStorage.getItem('secondaryRefreshToken');
    expireDate.value = localStorage.getItem('secondaryExpireToken');
  }

  function isTokenExpired() {
    return expireDate.value < (Date.now()+ 10*1000);
  }
  function reset() {
    accessToken.value = null;
    refreshToken.value = null;
    expireDate.value = null;
    user.value = null;
    localStorage.setItem('secondaryAccessToken', null);
    localStorage.setItem('secondaryRefreshToken', null);
    localStorage.setItem('secondaryExpireToken', null);
  }

  return { user, accessToken, refreshToken, expireDate, update, reset, fetchFromStorage, isTokenExpired }
})
