<script setup>
import AuthService from '@/services/auth-service';
import { ref } from 'vue';
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification()
var login = ref("");
var email = ref("");
var password = ref("");
var confirmPassword = ref("");
var captchaToken = ref(null);
var siteKey = ref(import.meta.env.VITE_HCAPTCHA_SITEKEY);
async function updateToken(token, eKey) {
  captchaToken.value = token;
}
async function register() {
  try {
    var e = await AuthService.register(login.value, password.value, email.value, captchaToken.value);
  } catch (err) {
    notify({
      title: "Authorization",
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
</style>