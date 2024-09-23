<template>
  <div v-if="visible" class="toast" :class="tipo">
    {{ mensaje }}
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { defineProps, defineEmits } from 'vue';


const props = defineProps({
  mensaje: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    default: 'info'  
  },
  duracion: {
    type: Number,
    default: 3000    
  }
});


const emit = defineEmits(['close']);
const visible = ref(true);


watchEffect(() => {
  setTimeout(() => {
    visible.value = false;
    emit('close');  
  }, props.duracion);
});
</script>

<style scoped>

.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  background-color: #333;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}


.toast.info {
  background-color: #383838;
}

.toast.exito {
  background-color: #a29bfe;
}

.toast.error {
  background-color: #812727;
}

.toast.advertencia {
  background-color: #FFC107;
}
</style>
