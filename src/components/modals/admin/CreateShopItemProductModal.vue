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
// Item description
const itemName = ref('');
const itemExtra = ref('');
const itemNbt = ref('');
const itemCustom = ref('{}');
const itemQuantity = ref(1);
const server = ref('');
//
const price = ref('');
const currency = ref('DONATE');
const picture = ref([]);
async function run() {
  try {
    var response = await RequestService.request('POST', 'shop/item/new', {
      displayName: displayName.value,
      description: description.value,
      itemName: itemName.value,
      itemExtra: itemExtra.value,
      itemNbt: itemNbt.value,
      itemCustom: itemCustom.value,
      itemQuantity: itemQuantity.value,
      server: server.value,
      price: price.value,
      currency: currency.value,
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
      <h3>Create ItemProduct</h3>
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
        <input type="text" v-model="itemName" placeholder="Minecraft item name">
      </div>
      <div class="form">
        <input type="text" v-model="itemExtra" placeholder="Minecraft item extra">
      </div>
      <div class="form">
        <textarea v-model="itemNbt" placeholder="Minecraft Item NBT"></textarea>
      </div>
      <div class="form">
        <textarea v-model="itemCustom" placeholder="Item Custom (WIP)"></textarea>
      </div>
      <div class="form">
        <input type="text" v-model="itemQuantity" placeholder="Minecraft item quantity">
      </div>
      <div class="form">
        <input type="text" v-model="server" placeholder="Server">
      </div>
      <div class="form">
        <input type="text" v-model="price" placeholder="Price">
      </div>
      <div class="form">
        <input type="text" v-model="currency" placeholder="Currency">
      </div>
      <div class="form">
        <AdminUpload v-model="picture"></AdminUpload>
      </div>
    </template>
  </modal>
</template>