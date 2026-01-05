<script setup>
import { watch, ref, onMounted, computed } from "vue";
import { SkinViewer } from "skinview3d";
import DefaultSkin from "@/assets/skins/DefaultSteve.png";

var props = defineProps(["skin", "cape"]);
var element = ref(null);
var skinOrDefault = computed(() =>
  props.skin ? props.skin : { url: DefaultSkin }
);
onMounted(() => {
  let skinViewer = new SkinViewer({
    canvas: element.value,
    width: 300,
    height: 400,
  });
  skinViewer.loadSkin(skinOrDefault.value.url);
  watch(skinOrDefault, (newValue) => skinViewer.loadSkin(newValue.url));
  if (props.cape) {
    skinViewer.loadCape(props.cape.url);
    watch(props.cape, (newValue) => skinViewer.loadCape(newValue.url));
  }
});
</script>
<template>
  <canvas ref="element"></canvas>
</template>
