import { ref, computed } from "vue";
import { defineStore } from "pinia";
import RequestService from "@/services/request-service";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const accessToken = ref(null);
  const refreshToken = ref(null);
  const expireDate = ref(null);
  function update(userData, authData) {
    if (userData) {
      user.value = userData;
    }
    if (authData) {
      accessToken.value = authData.accessToken;
      refreshToken.value = authData.refreshToken;
      expireDate.value = Date.now() + authData.expire;
      localStorage.setItem("accessToken", accessToken.value);
      localStorage.setItem("refreshToken", refreshToken.value);
      localStorage.setItem("expireToken", expireDate.value);
    }
    RequestService.accessToken = accessToken.value;
  }
  function fetchFromStorage() {
    accessToken.value = localStorage.getItem("accessToken");
    refreshToken.value = localStorage.getItem("refreshToken");
    expireDate.value = localStorage.getItem("expireToken");
    RequestService.accessToken = accessToken.value;
  }

  function isTokenExpired() {
    return expireDate.value < Date.now() + 10 * 1000;
  }
  function reset() {
    accessToken.value = null;
    refreshToken.value = null;
    expireDate.value = null;
    user.value = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expireToken");
    RequestService.accessToken = null;
  }

  function updateAsset(name, data) {
    if (!user.value) return;

    if (!user.value.textures) {
      user.value.textures = {};
    }

    user.value.textures[name] = data;

    console.log(`Texture ${name} updated:`, data);
    console.log("Updated user:", user.value);
  }

  function hasRole(role) {
    return computed(() => {
      if (!user.value) {
        return false;
      }
      for (var g of user.value.groups) {
        if (g.groupName == role) {
          return true;
        }
      }
      return false;
    });
  }

  return {
    user,
    accessToken,
    refreshToken,
    expireDate,
    update,
    reset,
    fetchFromStorage,
    isTokenExpired,
    updateAsset,
    hasRole,
  };
});
