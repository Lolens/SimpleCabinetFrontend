<script setup>
import RequestService from '@/services/request-service';
import Modal from '../ui/Modal.vue';
import { computed, ref, watch } from 'vue'

const showModal = ref(false)
async function run() {
  var response = await RequestService.request('GET', '', {
    });
}
async function onClick() {
  await run();
  showModal.value = false;
}
</script>
<template>
  <button @click="showModal = true">Button</button>
  <modal text="Ok Text" :show="showModal" @apply="onClick" @close="showModal = false">
    <template #header>
      <h3>Header</h3>
    </template>
    <template #body>
    </template>
  </modal>
</template>