<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import AuthService from "./services/auth-service";
import { useAuthStore } from "./stores/auth";
import Logo from "@/assets/logo.png";
import SudoService from "./services/sudo-service";
import { useBackupAuthStore } from "./stores/backupAuth";
import Dropdown from "./components/ui/Dropdown.vue";
var authAvailable = computed(() => store.user == null);
var logoutAvailable = computed(() => store.user != null);
var store = useAuthStore();
var backupAuthStore = useBackupAuthStore();
onMounted(() => {
  AuthService.wait().then(() => {});
  SudoService.load();
});
var isAdmin = store.hasRole("ADMIN");
var title = ref(import.meta.env.VITE_PROJECT_NAME);
</script>

<template>
  <header class="bg-card">
    <div class="fx-container">
      <RouterLink to="/" class="logo-text">{{ title }}</RouterLink>

      <div class="logo-wrapper">
        <img class="logo" :src="Logo" />
      </div>

      <div class="content">
        <RouterLink to="/" v-if="isAdmin">Home</RouterLink>
        <RouterLink to="/admin/users" v-if="isAdmin">Users</RouterLink>
        <RouterLink to="/cabinet" v-if="logoutAvailable">Cabinet</RouterLink>
        <Dropdown v-if="isAdmin">
          <template #header>
            <a @click="">Shop</a>
          </template>
          <template #content>
            <RouterLink to="/shop/group">Group shop</RouterLink>
            <RouterLink to="/shop/item">Item shop</RouterLink>
          </template>
        </Dropdown>
        <Dropdown v-if="isAdmin">
          <template #header>
            <a @click="">Admin Panel</a>
          </template>
          <template #content>
            <RouterLink to="/admin/group">Groups</RouterLink>
          </template>
        </Dropdown>
        <RouterLink to="/auth" v-if="authAvailable">Auth</RouterLink>
        <RouterLink to="/register" v-if="authAvailable">Register</RouterLink>
        <RouterLink to="/logout" v-if="logoutAvailable"
          >Log Out</RouterLink
        >
        <a
          @click="SudoService.unsudo()"
          v-if="backupAuthStore.accessToken != null"
          class="admin-action"
          >Exit from sudo</a
        >
      </div>
    </div>
  </header>
  <notifications position="bottom center" classes="my-notification" />
  <RouterView />
</template>

<style scoped>
header {
  padding: 20px 30px 20px 30px;
}

.fx-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

/* Текст — слева */
.logo-text {
  grid-column: 1;
  justify-self: start;
  font-family: "Bayon";
  letter-spacing: 5px;
  font-size: 50px;
  text-decoration: none;
  color: inherit;
}

/* Логотип — строго по центру */
.logo-wrapper {
  grid-column: 2;
  justify-self: center;
}

.logo {
  height: 64px;
  width: 64px;
}

/* Меню — справа */
.content {
  grid-column: 3;
  justify-self: end;
  display: flex;
  gap: 20px;
}

.title {
  grid-column: 2;
  justify-self: center;
}

.content > a,
.title > a,
.content > .dropdown > a,
.content > .dropdown > .dropdown-content > a {
  font-size: 20px;
  color: inherit;
  text-decoration: none;
  transition: 0.3s;
}
.content > .dropdown > .dropdown-content > a {
  display: block;
  cursor: pointer;
  padding: 12px 16px;
}
.content > .dropdown > .dropdown-content > a:hover {
  background-color: var(--colors-background-primary);
}
.content a:hover {
  color: var(--colors-text-action);
}
.admin-action {
  cursor: pointer;
  opacity: 0.6;
  color: var(--colors-red) !important;
}
.admin-action:hover {
  opacity: 1;
}
</style>
