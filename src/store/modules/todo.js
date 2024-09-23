import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from './users';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    tareas: [],
    categorias: [],
    categoriaSeleccionada: 'Todas',
    filtroSeleccionado: null,
  }),
  getters: {
    tareasFiltradas: (state) => {
      if (state.filtroSeleccionado) {
        return state.tareas.filter(tarea => tarea.estado === state.filtroSeleccionado.toLowerCase());
      }
      if (state.categoriaSeleccionada === 'Todas') {
        return state.tareas;
      }
      return state.tareas.filter(tarea => tarea.categoria === state.categoriaSeleccionada);
    },
  },
  actions: {
    async fetchTareas() {
      const userStore = useUserStore();
      if (userStore.usuario) {
        try {
          const response = await axios.get(`http://localhost:3000/usuarios/${userStore.usuario.id}`);
          this.tareas = response.data.tareas;
        } catch (error) {
          console.error('Error al obtener tareas:', error);
        }
      }
    },
    async fetchCategorias() {
      const userStore = useUserStore();
      if (userStore.usuario) {
        try {
          const response = await axios.get(`http://localhost:3000/usuarios/${userStore.usuario.id}`);
        
          this.categorias = response.data.categorias;
          
        } catch (error) {
          console.error('Error al obtener categorías:', error);
        }
      }
    },
    async agregarTarea(nuevaTarea) {
      const userStore = useUserStore();
      try {
        this.tareas.push(nuevaTarea);
        await axios.patch(`http://localhost:3000/usuarios/${userStore.usuario.id}`, {
          tareas: this.tareas
        });
      } catch (error) {
        console.error('Error adding task:', error);
      }
    },
    async actualizarTarea(idTarea, tareaActualizada) {
   
    
      const userStore = useUserStore();
      try {
        // Buscar la tarea por su ID directamente
        const tarea = this.tareas.find(tarea => tarea.id === idTarea);
        
       
        if (tarea) {
          // Actualizar los campos de la tarea con los nuevos valores

          Object.assign(tarea, tareaActualizada);
         

          // Enviar el array actualizado de tareas al servidor
          await axios.patch(`http://localhost:3000/usuarios/${userStore.usuario.id}`, {
            tareas: this.tareas
          });
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
    },
    async borrarTarea(idTarea) {
      const userStore = useUserStore();
      try {
        this.tareas = this.tareas.filter(tarea => tarea.id !== idTarea);
        await axios.patch(`http://localhost:3000/usuarios/${userStore.usuario.id}`, {
          tareas: this.tareas
        });
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
    
    async agregarCategoria(nuevaCategoria) {
      const userStore = useUserStore();
      try {
        this.categorias.push(nuevaCategoria);
        await axios.patch(`http://localhost:3000/usuarios/${userStore.usuario.id}`, {
          categorias: this.categorias
        });
      } catch (error) {
        console.error('Error adding category:', error);
      }
    },
    async borrarCategoria(idCategoria) {
      const userStore = useUserStore();
      try {
        this.categorias = this.categorias.filter(categoria => categoria.id !== idCategoria);
        await axios.patch(`http://localhost:3000/usuarios/${userStore.usuario.id}`, {
          categorias: this.categorias
        });
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    },
    filtrarTareasPorCategoria(categoria) {
      this.categoriaSeleccionada = categoria;
      this.filtroSeleccionado = null;
    },
    filtrarPorEstado(estado) {
      this.filtroSeleccionado = estado;
      this.categoriaSeleccionada = 'Todas';
    },
  },
});
