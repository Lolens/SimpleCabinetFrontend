<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNotification } from "@kyvg/vue3-notification";
import RequestService from '@/services/request-service';
const { notify } = useNotification()

var props = defineProps(['permission'])
var emit = defineEmits(['deleted'])

async function deleteMe() {
    try {
        var response = await RequestService.request('DELETE', 'group/permissions/id/'+props.permission.id, null);
        emit('deleted', response)
    } catch (err) {
        notify({
            title: "Permissions",
            text: err,
            type: 'error',
        });
    }
}

</script>
<template>
    <td>{{ permission.name }}</td>
    <td>{{ permission.value }}</td>
    <td>
        <FontAwesomeIcon @click="deleteMe" :icon="faTrash" class="adminpanel-icon adminpanel-icon-delete"></FontAwesomeIcon>
    </td>
</template>
<style scoped>
.adminpanel-icon-delete {
    color: var(--colors-red);
}

.adminpanel-icon {
    cursor: pointer;
    width: 20px;
    height: 20px;
}
</style>