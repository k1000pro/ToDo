<template>
   <Boton
      v-if="!pantallaGrande"
      @click="toggleSidebar"
      tipo="primary"
      class="toggle-boton"
    >
      <i :class="`fas ${sidebarAbierto ? 'fa-times' : 'fa-bars'}`"></i>
    </Boton>
  <div :class="['sidebar', { abierto: sidebarAbierto || pantallaGrande }]">
   
    <div v-if="userStore.usuario" class="seccion-perfil">
      <div class="info-usuario">
        <p class="nombre-usuario">{{ userStore.usuario.nombre_usuario }}</p>
        <p class="correo-usuario">{{ userStore.usuario.email }}</p>
      </div>
    </div>
    <List
      title=""
      :items="todas"
      :selectedItem="categoriaSeleccionada"
      @item-selected="seleccionarCategoria"
    />

    <List
      v-if="todoStore.categorias"
      title="Tus categorías"
      :items="todoStore.categorias"
      :selectedItem="categoriaSeleccionada"
      showButton
      buttonIcon="fa-regular fa-circle-xmark"
      @item-selected="seleccionarCategoria"
      @button-clicked="abrirModalBorrarCategoria"
    />

    <div class="agregar-categoria-container">
      <Input
        id="newCategory"
        v-model="nombreNuevaCategoria"
        placeholder="Nueva categoría"
      />
      <Boton
        @click="agregarCategoria"
        tipo="primary"
        class="confirmar-agregar-categoria-button"
        >+</Boton
      >
    </div>
    <List
      title="Estado"
      :items="filtros"
      :selectedItem="filtroSeleccionado"
      @item-selected="seleccionarFiltro"
    />

    <Boton
      @click="cerrarSesion"
      tipo="danger"
      class="cerrar-sesion-boton"
      iconoClass="fas fa-sign-out-alt"
    >
      <strong>Cerrar sesión</strong>
    </Boton>
  </div>
  <Modal
    id="modalEliminarCategoria"
    v-if="mostrarModalEliminarCategoria"
    titulo="Eliminar categoria"
  >
    <p>
      Si eliminas la categoria, se eliminaran las tareas que pertenezcan a la
      misma ¿Quieres borrarla de todos modos?
    </p>
    <div class="modal-boton-container">
      <Boton
        tipo="danger"
        class="borrar-categoria-boton"
        @click="borrarCategoria"
        >Confirmar</Boton
      >
      <Boton
        tipo="secondary"
        class="cancelar-borrar-categoria-boton"
        @click="mostrarModalEliminarCategoria = false"
        >Cancelar</Boton
      >
    </div>
  </Modal>
  <Toast
    v-if="toastVisible"
    :mensaje="toastMensaje"
    :tipo="toastTipo"
    :duracion="3000"
    @close="toastVisible = false"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineEmits } from "vue";
import { useRouter } from "vue-router";
import Boton from "../common/BotonComponente.vue";
import Input from "../common/InputComponente.vue";
import List from "../common/ListComponente.vue";
import Toast from "../common/NotificacionComponente.vue";
import Modal from "../tasks/Modal.vue";
import { useTodoStore } from "../../store/modules/todo";
import { useUserStore } from "../../store/modules/users";

const emit = defineEmits(["categoria-seleccionada", "filtro-seleccionado"]);

const router = useRouter();
const todoStore = useTodoStore();
const userStore = useUserStore();
const sidebarAbierto = ref(false);
const categoriaSeleccionada = ref("Todas");
const filtroSeleccionado = ref(null);
const pantallaGrande = ref(window.innerWidth >= 1024);
const nombreNuevaCategoria = ref("");
const toastVisible = ref(false);
const toastMensaje = ref("");
const toastTipo = ref("info");
const mostrarModalEliminarCategoria = ref(false);
const categoriaAEliminar = ref();
const todas = ref([{ nombre: "Todas", color: "#a29bfe" }]);
const filtros = ref([
  { nombre: "Pendientes", color: "#007bff" },
  { nombre: "Completadas", color: "#28a745" },
]);
//generar id aleatorio para las categorias
const generarIdAleatorio = () => {
  return Math.random().toString(36).substr(2, 8);
};
//generar color aleatorio para las categorias
const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const pastel = `hsl(${hue}, 100%, 85%)`;
  return pastel;
};
//mostrar notificaciones
function mostrarToast(mensaje, tipo) {
  toastMensaje.value = mensaje;
  toastTipo.value = tipo;
  toastVisible.value = false; 
  setTimeout(() => {
    toastVisible.value = true;
  }, 0); 
}
//manejar el estado del sidebar abierto o cerado
const toggleSidebar = () => {
  sidebarAbierto.value = !sidebarAbierto.value;
};
const agregarCategoria = () => {
  if (nombreNuevaCategoria.value.trim()) {
    const nuevaCategoria = {
      id: generarIdAleatorio(),
      nombre: nombreNuevaCategoria.value,
      color: getRandomPastelColor(),
    };

    todoStore.agregarCategoria(nuevaCategoria);
    nombreNuevaCategoria.value = "";
    mostrarToast("Categoria agregada!", "exito");
  }
};

const borrarCategoria = () => {
  const tareasAsociadas = todoStore.tareas.filter(
    (tarea) => tarea.categoria === categoriaAEliminar.value.nombre
  );

  tareasAsociadas.forEach((tarea) => {
    todoStore.borrarTarea(tarea.id);
  });

  todoStore.categorias = todoStore.categorias.filter(
    (cat) => cat.id !== categoriaAEliminar.value.id
  );
  todoStore.borrarCategoria(categoriaAEliminar.value.id);
  mostrarModalEliminarCategoria.value = false;
};

const abrirModalBorrarCategoria = (categoria) => {
  categoriaAEliminar.value = categoria;
  mostrarModalEliminarCategoria.value = true;
};

const seleccionarCategoria = (categoria) => {
  categoriaSeleccionada.value = categoria;
  filtroSeleccionado.value = null; // Reset filter when a category is selected
  emit("categoria-seleccionada", categoria);
};

const seleccionarFiltro = (filtro) => {
  filtroSeleccionado.value = filtro;
  categoriaSeleccionada.value = "Todas"; // Reset category when a filter is selected
  emit("filtro-seleccionado", filtro);
};
//saber el tamanio de la pantalla para manejar el sidebar
const handleRedimensionar = () => {
  pantallaGrande.value = window.innerWidth >= 1000;
};

const cerrarSesion = () => {
  router.push("/");
  userStore.usuario = null;
  userStore.cerrarSesion();
};

onMounted(() => {
  window.addEventListener("resize", handleRedimensionar);
  emit("categoria-seleccionada", "Todas");
});

onUnmounted(() => {
  window.removeEventListener("resize", handleRedimensionar);
});
</script>

<style scoped>
.sidebar {
  width: 300px;
  height: 100vh;
  background-color: #1f1f1f;
  position: fixed;
  top: 0;
  left: 0;
  transform: translateX(-100%);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  max-width: 80vw;
  z-index: 1000;
  overflow-y: auto;

}
.sidebar::-webkit-scrollbar {
    width: 5px;
    height: 8px;

}
.sidebar::-webkit-scrollbar-thumb {
    background: #2c2c2c;
    border-radius: 4px;
}

.sidebar.abierto {
  transform: translateX(0);
}

@media (min-width: 1024px) {
  .sidebar {
    position: relative;
    transform: translateX(0);
  }
}

.toggle-boton {
  position: fixed; 
  top: 20px;
  left: 20px; 
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 20px;
  z-index: 1001; 
}

.seccion-perfil {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #2c2c2c;
  color: white;
  border-top-right-radius: 10px;
}

.nombre-usuario {
  font-size: 16px;
  font-weight: 300;
}
.info-usuario {
  display: flex;
  flex-direction: column;
}
.correo-usuario {
  font-size: 12px;
  font-weight: 100;
  color: rgb(160, 160, 160);
}

.agregar-categoria-container {
  margin: 0px 10px 10px 10px;

  display: flex;
  gap: 10px;
  justify-content: center;
}

.confirmar-agregar-categoria-button {
  width: 25px;
  height: 25px;
  font-size: 25px;
  margin-top: 3px;
  padding: 16px;
}
.modal-boton-container {
  display: flex;
  justify-content: center;
}
#modalEliminarCategoria p {
  color: white;
  font-size: 13px;
}

.borrar-categoria-boton,
.cancelar-borrar-categoria-boton {
  margin-top: 10px;
  margin-right: 20px;
}
.cerrar-sesion-boton {
  padding: 5px;
  margin: 20px;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cerrar-sesion-boton i {
  font-size: 24px;
}
</style>
