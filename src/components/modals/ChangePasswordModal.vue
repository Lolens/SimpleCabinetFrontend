<script setup>
import RequestService from '@/services/request-service';
import Modal from '../ui/Modal.vue';
import { ref } from 'vue';
import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification();

const showModal = ref(false);
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

async function changePassword() {
  if (newPassword.value !== confirmPassword.value) {
    notify({
      title: "Change Password",
      text: "New password and confirmation do not match",
      type: 'error',
    });
    return;
  }

  try {
    await RequestService.request('POST', 'cabinet/security/changepassword', {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });
    showModal.value = false;
  } catch (err) {
    notify({
      title: "Change Password",
      text: err.message || err,
      type: 'error',
    });
  }
}
</script>

<template>
  <button @click="showModal = true">Change Password</button>
  <modal text="Change Password" :show="showModal" @apply="changePassword" @close="showModal = false">
    <template #header>
      <h3>Change Password</h3>
    </template>
    <template #body>
      <div class="form">
        <input type="text" v-model="oldPassword" placeholder="Old Password">
      </div>
      <div class="form">
        <input type="text" v-model="newPassword" placeholder="New Password">
      </div>
      <div class="form">
        <input type="text" v-model="confirmPassword" placeholder="Confirm Password">
      </div>
    </template>
  </modal>
</template>
