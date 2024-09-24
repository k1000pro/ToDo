<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">

        <Input
          label="Email"
          id="email"
          type="text"
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


        <Button type="primary" class="login-boton">Iniciar Sesión</Button>
      </form>
      <div class="login-opciones">
        <p>o</p>

        <a href="#" @click.prevent="registrarse">Registrarse</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/modules/users";
import Button from "../components/common/BotonComponente.vue";
import Input from "../components/common/InputComponente.vue";


const userStore = useUserStore();
const router = useRouter();


const email = ref("");
const contrasenia = ref("");
const emailError = ref("");
const contraseniaError = ref("");


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

//manerjar iniciar sesion
const handleLogin = async () => {
  const emailValido = validarEmail();
  const contraseniaValida = validarContrasenia();

  if (emailValido && contraseniaValida) {
    const success = await userStore.iniciarSesion(
      email.value,
      contrasenia.value
    );
    if (success) {
      router.push("/tareas"); 
    } else {
      contraseniaError.value =
        "Contraseña o correo incorrecto, si aún no tienes una cuenta, regístrate.";
    }
  }
};


const registrarse = () => {
  router.push("/registrarse");
};

onMounted(async () => {
  await userStore.verificarSesion();
});
watch(
  () => userStore.usuario,
  (newUser) => {
    if (newUser) {
      router.replace("/tareas");
    }
  }
);
</script>

<style scoped>

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1e1e1e;
}


.login-form {
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 300px;
  text-align: center;
  max-width: 70vw;
}

.login-form h2 {
  color: #fff;
  margin-bottom: 20px;
}


.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.login-boton {
  width: 96%;
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
