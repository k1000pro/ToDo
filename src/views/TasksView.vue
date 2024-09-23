<template>
  <main>
    <Sidebar
      @categoria-seleccionada="filtrarTareasPorCategoria"
      @filtro-seleccionado="filtrarPorEstado"
    ></Sidebar>

    <div v-if="todoStore.tareas" class="main-container">
      <h1 class="categoria-titulo">
        <strong>
          Tareas
          <span v-if="todoStore.categoriaSeleccionada !== 'Todas'">
            de {{ todoStore.categoriaSeleccionada }}
          </span>
          <span v-if="todoStore.filtroSeleccionado">
            {{ todoStore.filtroSeleccionado.toLowerCase() }}
          </span>
        </strong>
      </h1>

      <p
        v-if="todoStore.tareasFiltradas.length === 0"
        class="mensaje-no-tareas"
      >
        No tienes tareas en esta categoría.
      </p>

      <div class="tareas-container">
        <Card
          v-for="tarea in todoStore.tareasFiltradas"
          :key="tarea.id"
          :tarea="tarea"
          @actualizarEstado="actualizarEstadoTarea(tarea)"
          @borrarTarea="borrarTarea(tarea.id)"
          @editarTarea="abrirModalEditarTarea"
        ></Card>

        <Boton
          tipo="primary boton-flotante"
          @click="mostrarModalAgregarTarea = true"
          >+</Boton
        >
      </div>

      <Modal
      id="modalAgregarTarea"
        v-if="mostrarModalAgregarTarea"
        titulo="Nueva tarea"
      >
        <form @submit.prevent="agregarTarea">
          <Input
            id="descripcionNuevaTarea"
            type="text"
            label="Tarea"
            v-model="descripcionNuevaTarea"
            placeholder="Nueva tarea"
            required
          ></Input>
          <p v-if="descripcionError" class="mensaje-error">
            {{ descripcionError }}
          </p>

          <Input
            id="fechaVencimientoNuevaTarea"
            type="date"
            label="Fecha de vencimiento"
            v-model="fechaVencimiento"
            required
          ></Input>
          <p v-if="fechaError" class="mensaje-error">{{ fechaError }}</p>

          <div class="select-input-container">
            <label for="categoriaNuevaTarea">Categoría</label>
            <select id="categoriaNuevaTarea" v-model="categoriaNuevaTarea">
              <option value="Seleccionar categoria" selected disabled>
                Seleccionar categoría
              </option>
              <option
                v-for="categoria in todoStore.categorias"
                :key="categoria"
                :value="categoria.nombre"
              >
                {{ categoria.nombre }}
              </option>
            </select>
          </div>
          <p v-if="categoriaError" class="mensaje-error">
            {{ categoriaError }}
          </p>

          <div class="modal-boton-container">
            <Boton
              tipo="primary"
              class="agregar-nueva-tarea-boton"
              @click="agregarTarea"
              >Agregar</Boton
            >
            <Boton
              tipo="secondary"
              class="cancelar-nueva-tarea-boton"
              @click="cancelarAgregarTarea"
              >Cancelar</Boton
            >
          </div>
        </form>
      </Modal>
      <Modal
      id="modalEditarTarea"
        v-if="mostrarModalEditarTarea"
        titulo="Editar tarea"
      >
        <form @submit.prevent="editarTarea">
          <Input
            id="descripcionEditarTarea"
            type="text"
            label="Tarea"
            v-model="descripcionEditarTarea"
            placeholder="Tarea"
            required
          ></Input>
          <p v-if="descripcionError" class="mensaje-error">
            {{ descripcionError }}
          </p>

          <Input
            id="fechaVencimientoEditarTarea"
            type="date"
            label="Fecha de vencimiento"
            v-model="fechaVencimientoEditarTarea"
            required
          ></Input>
          <p v-if="fechaError" class="mensaje-error">{{ fechaError }}</p>

          <div class="select-input-container">
            <label for="categoriaEditarTarea">Categoría</label>
            <select id="categoriaEditarTarea" v-model="categoriaEditarTarea">
              <option value="Seleccionar categoria" selected disabled>
                Seleccionar categoría
              </option>
              <option
                v-for="categoria in todoStore.categorias"
                :key="categoria"
                :value="categoria.nombre"
              >
                {{ categoria.nombre }}
              </option>
            </select>
          </div>
          <p v-if="categoriaError" class="mensaje-error">
            {{ categoriaError }}
          </p>

          <div class="modal-boton-container">
            <Boton
              tipo="primary"
              class="agregar-nueva-tarea-boton"
              @click="editarTarea"
              >Editar</Boton
            >
            <Boton
              tipo="secondary"
              class="cancelar-nueva-tarea-boton"
              @click="cancelarEditarTarea"
              >Cancelar</Boton
            >
          </div>
        </form>
      </Modal>

 
      <Toast
        v-if="toastVisible"
        :mensaje="toastMensaje"
        :tipo="toastTipo"
        :duracion="3000"
        @close="toastVisible = false"
      />
    </div>
  </main>
</template>

<script setup>
import Sidebar from "../components/layout/Sidebar.vue";
import Card from "../components/tasks/Card.vue";
import Boton from "../components/common/BotonComponente.vue";
import Modal from "../components/tasks/Modal.vue";
import Input from "../components/common/InputComponente.vue";
import Toast from "../components/common/NotificacionComponente.vue";
import { useTodoStore } from "../store/modules/todo";
import { useUserStore } from "../store/modules/users";
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';

const todoStore = useTodoStore();
const userStore = useUserStore();
const router = useRouter();
const mostrarModalAgregarTarea = ref(false);
const descripcionNuevaTarea = ref("");
const fechaVencimiento = ref("");
const categoriaNuevaTarea = ref("Seleccionar categoria");
const mostrarModalEditarTarea = ref(false);
const descripcionEditarTarea = ref("");
const fechaVencimientoEditarTarea = ref("");
const categoriaEditarTarea = ref("Seleccionar categoria");
const toastVisible = ref(false);
const toastMensaje = ref("");
const toastTipo = ref("info");
const descripcionError = ref("");
const fechaError = ref("");
const categoriaError = ref("");
const idTareaAEditar=ref("")

const generarIdAleatorio = () => {
  return Math.random().toString(36).substr(2, 8);
};
const validarFormTarea = (descripcion,fechaVencimiento,categoria) => {
  let isValid = true;

  // Validar descripción
  if (descripcion.length < 3) {
    descripcionError.value = "La descripción debe tener al menos 3 caracteres.";
    isValid = false;
  } else {
    descripcionError.value = "";
  }

  // Validar fecha
  if (!fechaVencimiento) {
    fechaError.value = "La fecha de vencimiento es requerida.";
    isValid = false;
  } else {
    fechaError.value = "";
  }

  // Validar categoría
  if (categoria === "Seleccionar categoria") {
    categoriaError.value = "Debes seleccionar una categoría.";
    isValid = false;
  } else {
    categoriaError.value = "";
  }

  return isValid;
};


function mostrarToast(mensaje, tipo) {
  toastMensaje.value = mensaje;
  toastTipo.value = tipo;
  toastVisible.value = false; // Ocultar el toast antes de mostrar uno nuevo
  setTimeout(() => {
    toastVisible.value = true; // Mostrar el toast con un pequeño retraso
  }, 0);
}

const agregarTarea = () => {
  const nuevaTareaValida = validarFormTarea(descripcionNuevaTarea.value,fechaVencimiento.value,categoriaNuevaTarea.value,)

  if (nuevaTareaValida) {
    const nuevaTarea = {
      id: generarIdAleatorio(),
      descripcion: descripcionNuevaTarea.value,
      fechaVencimiento: fechaVencimiento.value,
      categoria: categoriaNuevaTarea.value,
      estado: "pendientes",
      createdAt: new Date().toISOString(),
    };
    todoStore.agregarTarea(nuevaTarea);
    mostrarModalAgregarTarea.value = false; // Cerrar modal
    // Limpiar campos
    descripcionNuevaTarea.value = "";
    fechaVencimiento.value = "";
    categoriaNuevaTarea.value = "Seleccionar categoria";
    mostrarToast("Tarea agregada!", "exito");
  }
};
const editarTarea = () => {
  const editarTareaValida = validarFormTarea(descripcionEditarTarea.value,fechaVencimientoEditarTarea.value,categoriaEditarTarea.value,)

  if (editarTareaValida) {
    const tareaEditada = {
      descripcion: descripcionEditarTarea.value,
      fechaVencimiento: fechaVencimientoEditarTarea.value,
      categoria: categoriaEditarTarea.value,
      estado: "pendientes",
      createdAt: new Date().toISOString(),
    };
    todoStore.actualizarTarea(idTareaAEditar.value,tareaEditada);
    idTareaAEditar.value=""
    mostrarModalEditarTarea.value = false; // Cerrar modal
    // Limpiar campos
    descripcionEditarTarea.value = "";
    fechaVencimientoEditarTarea.value = "";
    categoriaEditarTarea.value = "Seleccionar categoria";
    mostrarToast("Tarea editada!", "exito");
  }
};

const borrarTarea = (id) => {
  todoStore.borrarTarea(id);
  mostrarToast("Tarea eliminada", "info");
};
const cancelarEditarTarea = () => {
  mostrarModalEditarTarea.value = false;
  idTareaAEditar.value=""
  descripcionEditarTarea.value = "";
  fechaVencimientoEditarTarea.value = "";
  categoriaEditarTarea.value = "Seleccionar categoria";
};
const abrirModalEditarTarea = (tarea) => {
 
  idTareaAEditar.value=tarea.id
  descripcionEditarTarea.value = tarea.descripcion;
  fechaVencimientoEditarTarea.value = tarea.fechaVencimiento;
  categoriaEditarTarea.value = tarea.categoria;
  mostrarModalEditarTarea.value = true;
};

const cancelarAgregarTarea = () => {
  mostrarModalAgregarTarea.value = false;
  descripcionNuevaTarea.value = "";
  fechaVencimiento.value = "";
  categoriaNuevaTarea.value = "Seleccionar categoria";
};

const actualizarEstadoTarea = (tareaAActualizar) => {
  tareaAActualizar.estado =tareaAActualizar.estado === "pendientes" ? "completadas" : "pendientes";
  todoStore.actualizarTarea(tareaAActualizar.id);
};


const filtrarTareasPorCategoria = (categoria) => {
  todoStore.filtrarTareasPorCategoria(categoria);
};

const filtrarPorEstado = (estado) => {
  todoStore.filtrarPorEstado(estado);
};




onMounted(async () => {
  await userStore.verificarSesion();
  if (!userStore.usuario) {
    router.replace("/");
  } else {
    todoStore.fetchCategorias();
    todoStore.fetchTareas();
  }
});
</script>

<style scoped>

main {
  display: flex;
}


.categoria-titulo {
  margin-top: 20px;
  color: #fff;
  text-align: center; 
}


.main-container {
  display: flex;
  flex-direction: column;
  align-items: center; 
  width: 80vw;
  margin-left: 0;
  transition: margin-left 0.3s ease;
}


.tareas-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 16px;
  gap: 20px;
}


@media (max-width: 1023px) {
  .main-container {
    width: 100vw;
  }
}


.boton-flotante {
  position: fixed;
  bottom: 20px;
  right: 20px;
  border-radius: 30%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}


.select-input-container {
  display: flex;
  flex-direction: column;
}

.select-input-container label {
  color: white;
}

.select-input-container select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease;
  width: 100%;
}


.modal-boton-container {
  display: flex;
  justify-content: center;
}

.agregar-nueva-tarea-boton,
.cancelar-nueva-tarea-boton {
  margin-top: 10px;
  margin-right: 20px;
}
.mensaje-no-tareas {
  color: #fff;
  text-align: center;
  margin: 20px 0;
}
.mensaje-error {
  color: red;
  font-size: 12px;

  margin-bottom: 10px;
}
</style>
