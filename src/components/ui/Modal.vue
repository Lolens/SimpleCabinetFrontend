<script setup>
import { ref } from 'vue';
const props = defineProps(['show', 'text'])
const $emit = defineEmits(['close', 'apply'])
const mask = ref(null);
function onMaskClick(e) {
  if(e.target != mask.value) {
    return;
  }
  $emit('close');
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" ref="mask" class="modal-mask" @click="onMaskClick">
        <div class="modal-container">
          <div class="modal-header">
              <slot name="header">default header</slot>
          </div>

          <div class="modal-body">
            <slot name="body">default body</slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <div class="modal-default-actions">
                 <button class="modal-close-button" @click="$emit('close')">Close</button>
                 <button class="modal-default-button" @click="$emit('apply')" v-if="text">{{ text }}</button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 300px;
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0px 5px 10px 0px var(--colors-background-shadow);
  transition: all 0.3s ease;
}

.modal-header {
  width: 100%;
}

.modal-header h3 {
  margin-top: 0;
  color: var(--colors-text-primary);
}

.modal-header-container {
  width: fit-content;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>