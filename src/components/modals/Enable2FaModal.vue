<script setup>
import AuthService from '@/services/auth-service';
import RequestService from '@/services/request-service';
import Modal from '../ui/Modal.vue';
import { computed, ref, watch } from 'vue'
import QrcodeVue from 'qrcode.vue';
import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification()


const showModal = ref(false)
const file = ref(null);
var url = ref('');
var secret = ref('');
async function run() {
  await AuthService.wait();
  var response = await RequestService.request('POST', 'cabinet/security/prepare2fa', null);
  url.value = response.uri;
  secret.value = response.secret;
}
async function enable2Fa() {
  try {
    var response = await RequestService.request('GET', 'cabinet/security/enable2fa', {
      secret: secret.value,
      code: code.value
    });
  } catch (err) {
    notify({
      title: "2FA",
      text: err,
      type: 'error',
    });
  }
}
watch(showModal, (newValue) => {
  if (newValue) {
    run();
  }
})
async function enable() {
  await enable2Fa();
  showModal.value = false;
}
</script>
<template>
  <button @click="showModal = true">Enable 2FA</button>
  <modal text="Enable" :show="showModal" @apply="enable" @close="showModal = false">
    <template #header>
      <h3>Enable 2FA</h3>
    </template>
    <template #body>
      <div class="form">
        <qrcode-vue :value="url" size="300"></qrcode-vue>
      </div>
      <div class="form">
        <input type="text" v-model="code" placeholder="TOTP code">
      </div>
    </template>
  </modal>
</template>