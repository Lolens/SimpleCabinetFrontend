<script setup>
import AssetService from '@/services/asset-service';
import Modal from '../ui/Modal.vue';
import { computed, ref } from 'vue'

import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification()

const $emit = defineEmits(['uploaded']);
const showModal = ref(false)
const file = ref(null);
const toggleSlim = ref(false);
const skin = ref(null);
async function upload() {
  try {
    var response = await AssetService.uploadCape(file.value.files[0]);
    $emit('uploaded', response);
    showModal.value = false;
  } catch (err) {
    notify({
      title: "Upload",
      text: err,
      type: 'error',
    });
  }
}
</script>
<template>
  <button @click="showModal = true">Upload Cape</button>
  <modal text="Upload" :show="showModal" @apply="upload" @close="showModal = false">
    <template #header>
      <h3>Upload Cape</h3>
    </template>
    <template #body>
      <div class="form">
        <input ref="file" type="file">
      </div>
    </template>
  </modal>
</template>