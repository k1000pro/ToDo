<template>
  <div class="register-container">
    <div class="register-form">
      <h2>Crear cuenta</h2>
      <form @submit.prevent="handleRegister">

        <Input
          label="Nombre"
          id="nombre"
          type="text"
          v-model="nombre"
          required
        ></Input>
        <p v-if="nombreError" class="error">{{ nombreError }}</p>


        <Input
          label="Correo electrónico"
          id="email"
          type="email"
          v-model="email"
          required
        ></Input>
        <p v-if="emailError" class="error">{{ emailError }}</p>


        <Input
          label="Contraseña"
          id="contrasenia"
          type="password"
          v-model="contrasenia"
          required
        ></Input>
        <p v-if="contraseniaError" class="error">{{ contraseniaError }}</p>


        <Input
          label="Verificar contraseña"
          id="verificarContrasenia"
          type="password"
          v-model="verificarContrasenia"
          required
        ></Input>
        <p v-if="verificarContraseniaError" class="error">
          {{ verificarContraseniaError }}
        </p>


        <Button type="primary" class="login-boton">Registrarme</Button>
      </form>
      <div class="login-opciones">
        <p>o</p>

        <a href="#" @click.prevent="signUp">Ya tengo una cuenta</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref ,onMounted,watch} from "vue";
import { useRouter } from "vue-router";
import Button from "../components/common/BotonComponente.vue";
import Input from "../components/common/InputComponente.vue";
import { useUserStore } from "../store/modules/users";
import bcrypt from "bcryptjs"


const userStore = useUserStore();
const router = useRouter();


const nombre = ref("");
const email = ref("");
const contrasenia = ref("");
const verificarContrasenia = ref("");

const nombreError = ref("");
const emailError = ref("");
const contraseniaError = ref("");
const verificarContraseniaError = ref("");

const validarNombre = () => {
  if (nombre.value.length < 3) {
    nombreError.value = "El nombre debe tener al menos 3 caracteres.";
    return false;
  }
  nombreError.value = "";
  return true;
};


const validarEmail = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    emailError.value = "El correo electrónico no es válido.";
    return false;
  }
  emailError.value = "";
  return true;
};


const validarContrasenia = () => {
  if (contrasenia.value.length < 6) {
    contraseniaError.value = "La contraseña debe tener al menos 6 caracteres.";
    return false;
  }
  contraseniaError.value = "";
  return true;
};


const validarVerificarContrasenia = () => {
  if (contrasenia.value !== verificarContrasenia.value) {
    verificarContraseniaError.value = "Las contraseñas no coinciden.";
    return false;
  }
  verificarContraseniaError.value = "";
  return true;
};


const handleRegister = async () => {
  const nombreValido = validarNombre();
  const emailValido = validarEmail();
  const contraseniaValida = validarContrasenia();
  const verificarContraseniaValida = validarVerificarContrasenia();


  const generarIdAleatorio = () => {
    return Math.random().toString(36).substr(2, 8);
  };

  if (
    nombreValido &&
    emailValido &&
    contraseniaValida &&
    verificarContraseniaValida
  ) {
    const nivelSeguridad=bcrypt.genSaltSync(10);
    const hashedContrasenia=bcrypt.hashSync(contrasenia.value,nivelSeguridad) 
    const usuario = {
      id: generarIdAleatorio(),
      nombre_usuario: nombre.value,
      email: email.value,
      contrasenia: hashedContrasenia,
      categorias: [
      ],
      tareas: [],
    };


    const success = await userStore.registrarse(usuario);
    if (success) {
      router.push("/tareas"); 
    } else {
      verificarContraseniaError.value = "Ese correo ya está registrado.";
    }
  }
};


const signUp = () => {
  router.push("/");
};
onMounted(async () => {
  await userStore.verificarSesion();
});
watch(() => userStore.usuario, (newUser) => {
  if (newUser) {
    router.replace("/tareas");
    
  }
});
</script>

<style scoped>

.registrarse-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1e1e1e;
}


.registrarse-form {
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 300px;
  text-align: center;
  max-width: 70vw;
}

.registrarse-form h2 {
  color: #fff;
  margin-bottom: 20px;
}


.input-group {
  margin-bottom: 15px;
  text-align: left;
}


.login-boton {
  width: 96%;
  margin-top: 30px;
}

.login-opciones {
  margin-top: 15px;
}


.login-opciones a,
p {
  color: #ffffff;
  text-decoration: none;
  margin: 0 5px;
}

.login-opciones a:hover {
  text-decoration: underline;
}


.error {
  color: red;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>
