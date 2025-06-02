<script setup>
import RequestService from '@/services/request-service';
import Modal from '../../../ui/Modal.vue';
import { computed, ref, watch } from 'vue'
import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification()
const emit = defineEmits(['created'])

const showModal = ref(false)
const file = ref(null);
var name = ref('');
var displayName = ref('');
var parent = ref('')
async function createGroup() {
  try {
    var response = await RequestService.request('POST', 'group/new', {
      id: name.value,
      displayName: displayName.value,
      parentId: parent.value ? parent.value : null
    });
    emit('created', response)
  } catch (err) {
    notify({
      title: "2FA",
      text: err,
      type: 'error',
    });
  }
}
async function create() {
  await createGroup();
  showModal.value = false;
}
</script>
<template>
  <button @click="showModal = true">Create Group</button>
  <modal text="Create" :show="showModal" @apply="create" @close="showModal = false">
    <template #header>
      <h3>Create Group</h3>
    </template>
    <template #body>
      <div class="form">
        <input type="text" v-model="name" placeholder="Name">
        <input type="text" v-model="displayName" placeholder="DisplayName">
        <input type="text" v-model="parent" placeholder="ParentId">
      </div>
    </template>
  </modal>
</template>