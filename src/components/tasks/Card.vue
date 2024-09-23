<template>
  <div>
    <div v-if="tarea" class="tarea-card" :class="{ completed: tarea.estado === 'completadas' }">
      <div class="tarea-header">
        <button @click="editarTarea" class="boton-editar" title="Editar tarea">
          <i class="fas fa-edit"></i>
        </button>
        <button @click="borrarTarea" class="boton-borrar" title="Borrar tarea">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <p v-if="tarea.descripcion" class="tarea-descripcion">{{ tarea.descripcion }}</p>
      <div class="tarea-info">
        <span class="tarea-fecha-vencimiento">{{ tarea.fechaVencimiento }}</span>
        <span class="tarea-categoria">{{ tarea.categoria }}</span>
      </div>
      <Button
        @click="cambiarEstado"
        :tipo="tarea.estado === 'pendientes' ? 'primary' : 'secondary'"
        class="estado-boton"
        :icono-class="tarea.estado === 'pendientes' ? 'fas fa-check' : 'fas fa-undo'"
      >
        {{ tarea.estado === 'pendientes' ? 'Por hacer' : 'Hecha' }}
      </Button>
    </div>
    <div v-else>
      <p>Cargando tarea...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@fortawesome/fontawesome-free/css/all.css';
import Button from '../common/BotonComponente.vue'; 

const props = defineProps({
  tarea: {
    type: Object,
    required: false
  }
});

const emit = defineEmits(['actualizar-estado', 'editar-tarea', 'borrar-tarea']);

const tarea = ref(props.tarea);


const cambiarEstado = () => {
  emit('actualizar-estado');
};


const editarTarea = () => {
  emit('editar-tarea', tarea.value);
};


const borrarTarea = () => {
  emit('borrar-tarea', tarea.value);
};
</script>

<style scoped>
.tarea-card {
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  width: 200px; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-all;
  position: relative; 
}

.tarea-card.completed {
  background-color: #444;
  border-color: #666;
}

.boton-editar,
.boton-borrar {
  position: absolute;
  background-color: #2c2c2c;
  font-size: 0.8em;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.4s ease;
  opacity: 0; 
  pointer-events: none; 
  border-radius: 50%;
}

.boton-editar {
  left: 5px;
  top: 5px;
}

.boton-borrar {
  right: 5px;
  top: 5px;
}

.tarea-card:hover .boton-editar,
.tarea-card:hover .boton-borrar {
  opacity: 1; 
  pointer-events: auto; 
}

.tarea-descripcion {
  font-size: 1em;
  margin-bottom: 10px;
  color: #ffffff;
  text-align: center;
}

.tarea-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 0.8em;
  color: #888;
  margin-top: 10px;
}

.tarea-fecha-vencimiento,
.tarea-categoria {
  font-size: 0.8em;
  color: #888;
}

.estado-boton {
  width: 100%; 
}
</style>
