<script setup>
import AuthService from '@/services/auth-service';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification()
var login = ref("");
var email = ref("");
var password = ref("");
var confirmPassword = ref("");
var captchaToken = ref(null);
var siteKey = ref(import.meta.env.VITE_HCAPTCHA_SITEKEY);
var router = useRouter();
async function updateToken(token, eKey) {
  captchaToken.value = token;
}
async function register() {
  try {
    var e = await AuthService.register(login.value, password.value, email.value, captchaToken.value);
    notify({
      title: "Registration",
      text: "Registration completed",
      type: 'success',
    });
    router.push('/auth');
  } catch (err) {
    notify({
      title: "Registration",
      text: err,
      type: 'error',
    });
  }
}
</script>

<template>
  <main class="card-container">
    <div class="card auth-card">
      <h2>Register</h2>
      <div class="form">
        <input type="text" v-model="login" placeholder="Login"></input>
      </div>
      <div class="form">
        <input type="password" v-model="password" placeholder="Password"></input>
      </div>
      <div class="form">
        <input type="password" v-model="confirmPassword" placeholder="Confirm password"></input>
      </div>
      <div class="form">
        <input type="text" v-model="email" placeholder="Email"></input>
      </div>
      <div class="form">
        <vue-hcaptcha :sitekey="siteKey" @verify="updateToken"></vue-hcaptcha>
      </div>
      <div class="form">
        <button type="submit" @click="register">Register</button>
      </div>
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