<script setup>
import RequestService from '@/services/request-service';
import Modal from '../../../ui/Modal.vue';
import { computed, ref, watch } from 'vue'
import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification()
const emit = defineEmits(['created'])

const props = defineProps(['group'])
const showModal = ref(false)
const file = ref(null);
var name = ref('');
var value = ref('');
async function createGroup() {
  try {
    var response = await RequestService.request('POST', 'group/id/'+props.group.id+'/permissions/new', {
      name: name.value,
      value: value.value,
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
  <button @click="showModal = true">Create Group Permission</button>
  <modal text="Create" :show="showModal" @apply="create" @close="showModal = false">
    <template #header>
      <h3>Create Group Permission</h3>
    </template>
    <template #body>
      <div class="form">
        <input type="text" v-model="name" placeholder="Name">
        <input type="text" v-model="value" placeholder="Value">
      </div>
    </template>
  </modal>
</template>