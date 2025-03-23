<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Dropdown from './ui/Dropdown.vue';
import { computed, ref } from 'vue';
import SudoService from '@/services/sudo-service';
import { useAuthStore } from '@/stores/auth';
var props = defineProps(['user'])
var authStore = useAuthStore()
var actions = ref([
    {
        check() {
            return true;
        },
        async run() {
            await SudoService.sudo(props.user.id);
        },
        text: "Login as user"
    }
]);
</script>
<template>
    <Dropdown>
        <template #header>
            <FontAwesomeIcon :icon="faBars" class="adminpanel-icon"></FontAwesomeIcon>
        </template>
        <template #content>
            <div v-for="action in actions.filter(e => e.check())" class="adminpanel-action" @click="action.run()">
                {{ action.text }}
            </div>
        </template>
    </Dropdown>
</template>
<style scoped>
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