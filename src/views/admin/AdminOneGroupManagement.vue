<script setup>
import RequestService from '@/services/request-service';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import InfiniteLoading from "v3-infinite-loading";
import CreateGroupPermissionModal from '@/components/modals/admin/panel/CreateGroupPermissionModal.vue';
import AdminPermission from '@/components/admin/AdminPermission.vue';
const route = useRoute()
var group = ref(null);
var result = ref(null);
var permissions = ref([]);
var pageId = ref(0);

async function refresh(id) {
    if (id == "default") {
        group.value = {
            id: "default",
            displayName: "Default"
        };
    } else {
        group.value = await RequestService.request('GET', 'group/id/' + id, null);
    }
    await loadMore(false)
}

async function loadMore(needCheck) {
    if (needCheck && pageId.value >= result.value.totalPages) {
        return;
    }
    var url = 'group/id/'+route.params.id+'/permissions/page/' + pageId.value;
    result.value = await RequestService.request('GET', url);
    for (var e of result.value.data) {
        permissions.value.push(e);
    }
    pageId.value = pageId.value + 1;
}
refresh(route.params.id)
watch(route, (route) => {
    refresh(route.params.id)
})
</script>
<template>
    <main class="card-container">
        <div class="card group-card" v-if="group">
            <div class="card-header">
                <span class="username">{{ group.displayName }}</span>
            </div>
            <div class="card-section">
                ID: {{ group.id }}
            </div>
            <div class="card-section" v-if="group.parentId">
                Parent: <RouterLink :to="'/admin/group/id/' + group.parentId">{{ group.parentId }}</RouterLink>
            </div>
            <div class="card-section">
                <div class="form">
                    <CreateGroupPermissionModal :group="group" @created="permissions.push($event)"></CreateGroupPermissionModal>
                </div>
                <table>
                    <tbody>
                        <tr v-for="(permission, index) in permissions">
                            <AdminPermission :permission="permission" @deleted="permissions.splice(index, 1)"></AdminPermission>
                        </tr>
                    </tbody>
                </table>
                <InfiniteLoading v-if="result && pageId < result.totalPages" @infinite="loadMore(true)"></InfiniteLoading>
            </div>
        </div>
    </main>
</template>
<style scoped>
.username {
    font-weight: 600;
}

.group-card {
    min-width: 600px;
}
</style>