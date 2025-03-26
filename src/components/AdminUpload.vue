<script setup>
import AssetService from '@/services/asset-service';
import { ref, watch } from 'vue';

var $emit = defineEmits(['uploaded'])
var file = ref(null);
var model = defineModel();

async function onChanged() {
    var response = await AssetService.adminUpload(file.value.files[0]);
    model.value = response;
}
watch(model, (newValue) => {
    if(!newValue) {
        file.value.files = [];
    }
})
</script>
<template>
    <input ref="file" type="file" @change="onChanged">
</template>