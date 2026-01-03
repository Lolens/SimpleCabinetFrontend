<script setup>
import UserCard from '@/components/UserCard.vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
var authStore = useAuthStore();
var { user } = storeToRefs(authStore);
</script>

<template>
  <main class="card-container">
    <UserCard :user="user" :owner="true" v-if="user"></UserCard>
  </main>
</template>

