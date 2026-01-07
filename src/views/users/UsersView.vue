<script setup>
import { ref, watch } from "vue";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import RequestService from "@/services/request-service";
import AvatarHead from "@/components/AvatarHead.vue";
import { useRouter } from "vue-router";

var result = ref(null);
var users = ref([]);
var search = ref("");
var pageId = ref(0);
var router = useRouter();
async function loadMore(needCheck) {
  if (needCheck && pageId.value >= result.value.totalPages) {
    return;
  }
  var url =
    search.value.length > 0
      ? "users/search/" + search.value + "/" + pageId.value
      : "users/page/" + pageId.value;
  result.value = await RequestService.request("GET", url);
  for (var e of result.value.data) {
    users.value.push(e);
  }
  pageId.value = pageId.value + 1;
}
async function go(user) {
  router.push("/admin/users/by/id/" + user.id);
}
loadMore(false);
watch(search, (newValue) => {
  users.value = [];
  result.value = null;
  pageId.value = 0;
  loadMore(false);
});
</script>
<template>
  <main>
    <div class="form">
      <input type="text" placeholder="Search" v-model="search" />
    </div>
    <div class="user-minicard-container">
      <div class="card user-minicard" v-for="user in users" @click="go(user)">
        <div class="card-header">
          <AvatarHead class="avatar" :skin="user.textures ? user.textures.skin : null"></AvatarHead>
          <span class="card-username">{{ user.username }}</span>
        </div>
      </div>
      <InfiniteLoading
        v-if="result && pageId < result.totalPages"
        @infinite="loadMore(true)"
      ></InfiniteLoading>
    </div>
  </main>
</template>
<style scoped>
.avatar {
  width: 64px;
  height: 64px;
}

.user-minicard {
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  transition: 0.3s;
}

.user-minicard:hover {
  box-shadow: 0px 10px 15px 0px var(--colors-background-shadow);
}

.user-minicard + .user-minicard {
  margin-top: 20px;
}
.user-minicard-container {
  margin-top: 25px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.card-username {
  font-weight: 600;
  font-size: 24px;
}
</style>
