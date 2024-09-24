import { defineStore } from "pinia";
import axios from "axios";
import bcrypt from "bcryptjs";

export const useUserStore = defineStore("user", {
  state: () => ({
    usuario: null,

  }),
  
  actions: {
    //verificar si hay sesion iniciada
    async verificarSesion() {
  
      const email = localStorage.getItem('email');
      if (email) {
        try {
          const response = await axios.get("http://localhost:3000/usuarios");
          const user = response.data.find(user => user.email === email);
    
          if (user) {
            this.usuario = user;
      
          } else {
            this.usuario = null;
          }
        } catch (error) {
          console.error("Error al verificar sesión:", error);
          this.usuario = null;
        }
      } else {
        this.usuario = null;
      }
      return this.usuario != null;
    },
    
    async iniciarSesion(email, contrasenia) {
      try {
        const response = await axios.get("http://localhost:3000/usuarios");
        const user = response.data.find(user => user.email === email);

        if (user && bcrypt.compareSync(contrasenia, user.contrasenia)) {
          this.usuario = user;
          localStorage.setItem('email', email); // Guarda el email

        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
      }
      return this.usuario != null;
    },
    
    async registrarse(usuarioNuevo) {
      let cuentaExiste = false;
      try {
        const response = await axios.get("http://localhost:3000/usuarios");
        cuentaExiste = response.data.some(user => user.email === usuarioNuevo.email);
      } catch (error) {
        console.error("Error al verificar el registro:", error);
      }

      if (!cuentaExiste) {
        try {
          await axios.post("http://localhost:3000/usuarios/", usuarioNuevo);
          this.usuario = usuarioNuevo;
          localStorage.setItem('email', usuarioNuevo.email); // Guarda el email
          // Aquí podrías guardar el token si decides implementarlo
        } catch (error) {
          console.error("Error al registrarse:", error);
        }
      }
      return this.usuario != null;
    },
    
    cerrarSesion() {
      localStorage.removeItem('email'); // Elimina el email del localStorage
      location.reload()
    },
  },
});
