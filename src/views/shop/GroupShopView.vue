<script setup>
import CreateShopGroupProductModal from "@/components/modals/admin/CreateShopGroupProductModal.vue";
import GroupShopCard from "@/components/shop/GroupShopCard.vue";
import RequestService from "@/services/request-service";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import { ref, watch } from "vue";
import { useAuthStore } from '@/stores/auth';

var result = ref(null);
var search = ref('');
var items = ref([]);
var pageId = ref(0);
async function loadMore(needCheck) {
    if (needCheck && pageId.value >= result.value.totalPages) {
        return;
    }
    var url = search.value.length > 0 ? 
        'shop/group/search/' + search.value + '/' + pageId.value :
        'shop/group/page/' + pageId.value;
    result.value = await RequestService.request('GET', url);
    for (var e of result.value.data) {
        items.value.push(e);
    }
    pageId.value = pageId.value + 1;
}
loadMore(false);
watch(search, (newValue) => {
    items.value = [];
    result.value = null;
    pageId.value = 0;
    loadMore(false);
})
const authStore = useAuthStore();
var isAdmin = authStore.hasRole('ADMIN');
</script>
<template>
    <main>
        <div class="form" v-if="isAdmin">
            <CreateShopGroupProductModal></CreateShopGroupProductModal>
        </div>
        <div class="form">
            <input type="text" placeholder="Search" v-model="search">
        </div>
        <div class="group-shop-cards">
            <GroupShopCard :item="item" v-for="item in items">

            </GroupShopCard>
            <InfiniteLoading v-if="result && pageId < result.totalPages" @infinite="loadMore(true)"></InfiniteLoading>
        </div>
    </main>
</template>
<style scoped>

.group-shop-cards {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: 20px;
}
</style>