<script setup>
import AssetService from '@/services/asset-service';
import { ref } from 'vue';

var $emit = defineEmits(['uploaded'])
var file = ref(null);

async function onChanged() {
    var response = await AssetService.adminUpload(file.value.files[0]);
    $emit('uploaded', response);
}
</script>
<template>
    <input ref="file" type="file" @change="onChanged">
</template>