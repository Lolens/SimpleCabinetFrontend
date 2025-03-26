<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import AuthService from './services/auth-service';
import { useAuthStore } from './stores/auth';
import Logo from '@/assets/logo.svg'
import SudoService from './services/sudo-service';
import { useBackupAuthStore } from './stores/backupAuth';
import Dropdown from './components/ui/Dropdown.vue';
var authAvailable = computed(() => store.user == null);
var logoutAvailable = computed(() => store.user != null);
var store = useAuthStore();
var backupAuthStore = useBackupAuthStore();
onMounted(() => {
  AuthService.wait().then(() => {

  });
  SudoService.load();
});
var title = ref(import.meta.env.VITE_PROJECT_NAME)
</script>

<template>
  <header class="bg-card">
    <div class="fx-container">
      <div class="title">
        <img class="logo" :src="Logo">
        <RouterLink to="/">{{ title }}</RouterLink>
      </div>
      <div class="content">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/users">Users</RouterLink>
        <RouterLink to="/cabinet" v-if="logoutAvailable">Cabinet</RouterLink>
        <Dropdown>
          <template #header>
            <a @click="">Shop</a>
          </template>
          <template #content>
            <RouterLink to="/shop/group">Group shop</RouterLink>
            <RouterLink to="/shop/item">Item shop</RouterLink>
          </template>
        </Dropdown>
        <RouterLink to="/auth" v-if="authAvailable">Auth</RouterLink>
        <RouterLink to="/register" v-if="authAvailable">Register</RouterLink>
        <RouterLink to="/debug/logout" v-if="logoutAvailable">Log Out</RouterLink>
        <a @click="SudoService.unsudo()" v-if="backupAuthStore.accessToken != null" class="admin-action">Exit from sudo</a>
      </div>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  padding: 20px 30px 20px 30px;
}

.fx-container {
  display: flex;
  border-radius: 0px 0px 10px 10px;
}

.logo {
  height: 64px;
  width: 64px;
}

.content {
  display: flex;
  float: right;
  align-self: center;
  margin-left: auto;
  gap: 20px;
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  float: left;
}

.content>a,
.title>a,
.content>.dropdown>a,
.content>.dropdown>.dropdown-content>a  {
  font-size: 20px;
  color: inherit;
  text-decoration: none;
  transition: 0.3s;
}
.content>.dropdown>.dropdown-content>a {
  display: block;
  cursor: pointer;
  padding: 12px 16px;
}
.content>.dropdown>.dropdown-content>a:hover {
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
