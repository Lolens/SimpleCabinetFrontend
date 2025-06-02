<script setup>
import RequestService from '@/services/request-service';
import Modal from '../../ui/Modal.vue';
import { computed, ref, watch } from 'vue'
import { VMarkdownView } from 'vue3-markdown'
import AdminUpload from '@/components/AdminUpload.vue';
import { useNotification } from "@kyvg/vue3-notification";
const emit = defineEmits(['created'])
const { notify } = useNotification()

const showModal = ref(false)
const displayName = ref('');
const description = ref('');
const local = ref(true);
// Local: false
const name = ref('');
const server = ref('');
const world = ref('');
const context = ref('{}');
//
const expireDays = ref('');
const price = ref('');
const currency = ref('DONATE');
const stackable = ref(false);
const localName = ref('');
const picture = ref([]);
async function run() {
  try {
    var response = await RequestService.request('POST', 'shop/group/new', {
      displayName: displayName.value,
      description: description.value,
      name: name.value,
      local: local.value,
      server: server.value,
      world: world.value,
      context: context.value,
      expireDays: expireDays.value,
      price: price.value,
      currency: currency.value,
      context: context.value,
      stackable: stackable.value,
      localName: localName.value,
      pictureName: picture.value.name
    });
    emit('created', response)
  } catch (err) {
    notify({
      title: "Shop",
      text: err,
      type: 'error',
    });
  }
}
async function onClick() {
  await run();
  showModal.value = false;
}
</script>
<template>
  <button @click="showModal = true">Create</button>
  <modal text="Create" :show="showModal" @apply="onClick" @close="showModal = false">
    <template #header>
      <h3>Create GroupProduct</h3>
    </template>
    <template #body>
      <div class="form">
        <input type="text" v-model="displayName" placeholder="Display Name">
      </div>
      <div class="form">
        <textarea v-model="description" placeholder="Description"></textarea>
      </div>
      <div class="form">
        <VMarkdownView mode="light" :content="description"></VMarkdownView>
      </div>
      <div class="form">
        <input type="checkbox" v-model="local">
        <label>Local</label>
      </div>
      <div class="form" v-if="!local">
        <input type="text" v-model="name" placeholder="Name">
      </div>
      <div class="form" v-if="!local">
        <input type="text" v-model="server" placeholder="Server">
      </div>
      <div class="form" v-if="!local">
        <input type="text" v-model="world" placeholder="World">
      </div>
      <div class="form" v-if="!local">
        <input type="text" v-model="context" placeholder="Context">
      </div>
      <div class="form">
        <input type="text" v-model="expireDays" placeholder="Expire days">
      </div>
      <div class="form">
        <input type="text" v-model="price" placeholder="Price">
      </div>
      <div class="form">
        <input type="text" v-model="currency" placeholder="Currency">
      </div>
      <div class="form">
        <input type="checkbox" v-model="stackable">
        <label>Stackable</label>
      </div>
      <div class="form">
        <input type="text" v-model="localName" placeholder="Local Name">
      </div>
      <div class="form">
        <AdminUpload v-model="picture"></AdminUpload>
      </div>
    </template>
  </modal>
</template>