<script setup>
import RequestService from '@/services/request-service';
import Modal from '../ui/Modal.vue';
import { computed, ref, watch } from 'vue'
import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification()


const showModal = ref(false)
const file = ref(null);
var newPassword = ref('');
var confirmPassword = ref('');
var oldPassword = ref('');
async function changePassword() {
  try {
    var response = await RequestService.request('GET', 'cabinet/security/disable2fa', {
      code: code.value
    });
    showModal.value = false;
  } catch (err) {
    notify({
      title: "Change Password",
      text: err,
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