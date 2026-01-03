<script setup>
import AuthService from '@/services/auth-service';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNotification } from "@kyvg/vue3-notification";
import { useAuthStore } from '@/stores/auth';

const { notify } = useNotification();
const authStore = useAuthStore();
const login = ref("");
const password = ref("");
const totpCode = ref("");
const router = useRouter();
const isLoading = ref(false);

async function authorize(e) {
  e?.preventDefault();
  
  if (isLoading.value) return;
  
  isLoading.value = true;
  
  try {
    // Авторизуемся
    await AuthService.authorize(login.value, password.value, totpCode.value);
    
    // Даем время обновиться состоянию
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Проверяем, авторизован ли пользователь
    if (authStore.user) {
      // Получаем redirect параметр из URL или идем в кабинет
      const redirect = router.currentRoute.value.query.redirect;
      if (redirect && typeof redirect === 'string') {
        router.push(redirect);
      } else {
        router.push('/cabinet');
      }
    } else {
      notify({
        title: "Authorization",
        text: "Failed to authenticate",
        type: 'error',
      });
    }
  } catch (err) {
    notify({
      title: "Authorization",
      text: err.message || "Authorization failed",
      type: 'error',
    });
  } finally {
    isLoading.value = false;
  }
}

// Автоматический submit по Enter
function handleKeyPress(e) {
  if (e.key === 'Enter') {
    authorize();
  }
}
</script>

<template>
  <main class="card-container">
    <div class="card auth-card">
      <h2>Authorize</h2>
      <form @submit.prevent="authorize" @keypress="handleKeyPress">
        <div class="form">
          <input 
            type="text" 
            v-model="login" 
            placeholder="Login / Email"
            :disabled="isLoading"
            required
          >
        </div>
        <div class="form">
          <input 
            type="password" 
            v-model="password" 
            placeholder="Password"
            :disabled="isLoading"
            required
          >
        </div>
        <div class="form">
          <input 
            type="password" 
            v-model="totpCode" 
            placeholder="Totp Code (ЕСЛИ 2FA)"
            :disabled="isLoading"
          >
        </div>
        <div class="form">
          <button 
            type="submit" 
            :disabled="isLoading"
          >
            {{ isLoading ? 'Authorizing...' : 'Authorize' }}
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
.auth-card {
  min-width: 400px;
}

.form {
  margin-bottom: 0.25rem;
}

input {
  width: 100% !important;
  padding: 0.5rem !important;
  border: 1px solid #ccc !important;
  border-radius: 4px !important;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>