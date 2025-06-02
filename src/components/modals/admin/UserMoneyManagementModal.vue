<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ref, watch } from 'vue';
import RequestService from '@/services/request-service';
import Modal from '@/components/ui/Modal.vue';
import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification()

const showModal = ref(false);
const props = defineProps(['user'])
const balance = ref([]);
const transactionCurrency = ref('');
const transactionValue = ref('');
const transactionComment = ref('');
async function transaction() {
    var url;
    var value;
    if(transactionValue.value >= 0) {
        url = 'admin/money/addmoney/byid/'+props.user.id+'/'+transactionCurrency.value;
        value = transactionValue.value
    } else {
        url = 'admin/money/removemoney/byid/'+props.user.id+'/'+transactionCurrency.value;
        value = -transactionValue.value;
    }
try {
    var response = await RequestService.request('POST', url, {
        count: value,
        comment: transactionComment.value
    })
  } catch (err) {
    notify({
      title: "Money",
      text: err,
      type: 'error',
    });
  }
    updateBalance();
}
async function updateBalance() {
    var response = await RequestService.request('GET', 'admin/money/userbalance/all/userid/'+props.user.id+'/page/0');
    balance.value = response.data;
}
watch(showModal, (newValue) => {
    if(newValue) {
        updateBalance();
    }
})
</script>
<template>
    <div class="adminpanel-action" @click="showModal = true">
        Money Management
    </div>
    <modal text="OK" :show="showModal" @apply="showModal = false" @close="showModal = false">
        <template #header>
            <h3>{{ user.username }} - Money Management</h3>
        </template>
        <template #body>
            <h4>Admin add/remove money</h4>
            <div>
                <div class="form">
                    <input type="text" v-model="transactionCurrency" placeholder="Currency">
                </div>
                <div class="form">
                    <input type="text" v-model="transactionValue" placeholder="Value">
                </div>
                <div class="form">
                    <input type="text" v-model="transactionComment" placeholder="Comment">
                </div>
                <div class="form">
                    <button @click="transaction">Transaction</button>
                </div>
            </div>
            <h4>Balance</h4>
            <div class="adminpanel-groupmanagement-container">
                <div class="card adminpanel-groupmanagement-element" v-for="b in balance">
                    <div class="adminpanel-groupmanagement-element-name">
                        {{ b.balance }}
                    </div>
                    <div class="adminpanel-groupmanagement-element-currency">
                        {{ b.currency }}
                    </div>
                </div>
            </div>
        </template>
    </modal>
</template>
<style scoped>
.adminpanel-groupmanagement-element {
    display: flex;
    padding: 15px;
    box-sizing: border-box;
    width: 100%;
}

.adminpanel-groupmanagement-element-currency {
    margin-left: auto;
    font-weight: 800;
}

.adminpanel-groupmanagement-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    width: 100%;
    margin-top: 25px;
}
</style>