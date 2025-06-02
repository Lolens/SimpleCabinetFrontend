<script setup>
import AssetService from '@/services/asset-service';
import { ref, watch } from 'vue';
import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification()

var $emit = defineEmits(['uploaded'])
var file = ref(null);
var model = defineModel();

async function onChanged() {
    try {
        var response = await AssetService.adminUpload(file.value.files[0]);
        model.value = response;
    } catch (err) {
        notify({
            title: "Upload",
            text: err,
            type: 'error',
        });
    }
}
watch(model, (newValue) => {
    if (!newValue) {
        file.value.files = [];
    }
})
</script>
<template>
    <input ref="file" type="file" @change="onChanged">
</template>