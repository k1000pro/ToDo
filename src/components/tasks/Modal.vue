<template>

  <div class="modal-overlay" >

    <div class="modal-container">
      <h2 class="modal-titulo">{{props.titulo}}</h2>

      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineEmits,defineProps } from 'vue';


const props = defineProps({
  titulo: {
    type: String,
    required: false
  }
});

</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center; 
  justify-content: center; 
  z-index: 2000; 
}


.modal-container {
  background: #444; 
  padding: 20px; 
  border-radius: 8px; 
  width: 300px; 
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); 
}


.modal-titulo {
  color: #a29bfe; 
}
</style>
