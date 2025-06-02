<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ref } from 'vue';
import RequestService from '@/services/request-service';
import Modal from '@/components/ui/Modal.vue';
import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification()

const showModal = ref(false);
const props = defineProps(['user'])
const assignGroupName = ref('');
async function unassignGroup(group) {
    try {

        var response = await RequestService.request('POST', 'group/id/' + group + '/unassign', {
            userId: props.user.id
        })
    } catch (err) {
        notify({
            title: "Group",
            text: err,
            type: 'error',
        });
    }
}
async function assignGroup(group) {
    try {
        var response = await RequestService.request('POST', 'group/id/' + group + '/assign', {
            userId: props.user.id
        })
    } catch (err) {
        notify({
            title: "Group",
            text: err,
            type: 'error',
        });
    }
}
</script>
<template>
    <div class="adminpanel-action" @click="showModal = true">
        Group Management
    </div>
    <modal text="OK" :show="showModal" @apply="showModal = false" @close="showModal = false">
        <template #header>
            <h3>{{ user.username }} - Group Management</h3>
        </template>
        <template #body>
            <h4>Assign group</h4>
            <div>
                <div class="form">
                    <input type="text" v-model="assignGroupName" placeholder="Group name">
                </div>
                <div class="form">
                    <button @click="assignGroup(assignGroupName)">Assign group</button>
                </div>
            </div>
            <h4>Groups</h4>
            <div class="adminpanel-groupmanagement-container">
                <div class="card adminpanel-groupmanagement-element" v-for="group in user.groups">
                    <div class="adminpanel-groupmanagement-element-name">
                        {{ group.groupName }}
                    </div>
                    <div class="adminpanel-groupmanagement-element-unassign">
                        <FontAwesomeIcon :icon="faTrash" @click="unassignGroup(group.groupName)"></FontAwesomeIcon>
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

.adminpanel-groupmanagement-element-name {
    font-weight: 800;
}

.adminpanel-groupmanagement-element-unassign {
    margin-left: auto;
    color: var(--colors-red);
    cursor: pointer;
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