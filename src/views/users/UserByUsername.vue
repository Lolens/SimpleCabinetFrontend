<script setup>
import { ref } from 'vue';
import RequestService from '@/services/request-service';
import { useRoute } from 'vue-router';
import UserCard from '@/components/UserCard.vue';

var route = useRoute();
var user = ref(null);
RequestService.request('GET', 'users/name/'+route.params.name+"?assets=true", null).then((response) => user.value = response);
</script>
<template>
    <main class="card-container">
        <UserCard :user="user" :owner="false" v-if="user"></UserCard>
    </main>
</template>