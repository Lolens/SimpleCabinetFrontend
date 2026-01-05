<script setup>
import DefaultSkin from "@/assets/skins/DefaultSteve.png";
import { computed, watch, ref } from "vue";
var props = defineProps(['skin']);
var skinOrDefault = computed(() => {
  if (!props.skin || !props.skin.url) {
    return { url: DefaultSkin };
  }
  return props.skin;
});

async function makeAvater(skinUrl) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var img = new Image();
  img.crossOrigin = "anonymous";
  return new Promise((resolve, reject) => {
    img.onload = function () {
      var scale = img.naturalWidth / 64;
      var headpos = scale * 8;
      canvas.width = headpos;
      canvas.height = headpos;
      context.drawImage(
        img,
        headpos /*sourceX*/,
        headpos /*sourceX*/,
        headpos /*sourceWidth*/,
        headpos /*sourceHeight*/,
        0 /*destX*/,
        0 /*destY*/,
        headpos /*destWidth*/,
        headpos /*destHeight*/
      );
      context.drawImage(
        img,
        headpos * 5 /*sourceX*/,
        headpos /*sourceY*/,
        headpos /*sourceWidth*/,
        headpos /*sourceHeight*/,
        0 /*destX*/,
        0 /*destY*/,
        headpos /*destWidth*/,
        headpos /*destHeight*/
      );
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = function (e) {
      reject(e);
    };
    img.src = skinUrl;
  });
}
var image = ref(null);
makeAvater(skinOrDefault.value.url).then((e) => (image.value = e));
watch(skinOrDefault, (newValue) =>
  makeAvater(skinOrDefault.value.url).then((e) => (image.value = e))
);
</script>
<template>
  <img style="image-rendering: pixelated" :src="image" />
</template>
