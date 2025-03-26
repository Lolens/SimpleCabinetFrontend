<script setup>
import CreateShopItemProductModal from "@/components/modals/admin/CreateShopItemProductModal.vue";
import ItemShopCard from "@/components/shop/ItemShopCard.vue";
import RequestService from "@/services/request-service";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import { ref, watch } from "vue";

var result = ref(null);
var search = ref('');
var items = ref([]);
var pageId = ref(0);
async function loadMore(needCheck) {
    if (needCheck && pageId.value >= result.value.totalPages) {
        return;
    }
    var url = search.value.length > 0 ? 
        'shop/item/search/' + search.value + '/' + pageId.value :
        'shop/item/page/' + pageId.value;
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
</script>
<template>
    <main>
        <div class="form">
            <CreateShopItemProductModal></CreateShopItemProductModal>
        </div>
        <div class="form">
            <input type="text" placeholder="Search" v-model="search">
        </div>
        <div class="item-shop-cards">
            <ItemShopCard :item="item" v-for="item in items">

            </ItemShopCard>
            <InfiniteLoading v-if="result && pageId < result.totalPages" @infinite="loadMore(true)"></InfiniteLoading>
        </div>
    </main>
</template>
<style scoped>

.item-shop-cards {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: 20px;
}
</style>