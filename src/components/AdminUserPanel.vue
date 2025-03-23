<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Dropdown from './ui/Dropdown.vue';
import { computed, ref } from 'vue';
import SudoService from '@/services/sudo-service';
import { useAuthStore } from '@/stores/auth';
import UserGroupManagementModal from './modals/admin/UserGroupManagementModal.vue';
import UserMoneyManagementModal from './modals/admin/UserMoneyManagementModal.vue';
var props = defineProps(['user'])
var authStore = useAuthStore()
async function runSudo() {
    await SudoService.sudo(props.user.id);
}
</script>
<template>
    <Dropdown>
        <template #header>
            <FontAwesomeIcon :icon="faBars" class="adminpanel-icon"></FontAwesomeIcon>
        </template>
        <template #content>
            <div class="adminpanel-action" v-if="user.id != authStore.user.id" @click="runSudo">
                Login as user
            </div>
            <UserGroupManagementModal :user="user">
            </UserGroupManagementModal>
            <UserMoneyManagementModal :user="user">
                
            </UserMoneyManagementModal>
        </template>
    </Dropdown>
</template>
<style>
.adminpanel-action {
    color: var(--colors-red);
    cursor: pointer;
    padding: 12px 16px;
}
.adminpanel-action:hover {
    background-color: var(--colors-background-primary);
}
.adminpanel-icon {
    color: var(--colors-red);
    cursor: pointer;
    width: 20px;
    height: 20px;
}
</style>