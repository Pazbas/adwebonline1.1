<template>
  <div class="login-container d-flex justify-content-center align-items-center">
    <b-card class="p-4 login-card" style="max-width: 500px; width: 100%;">
      <h3 class="text-center mb-3 text-primary fw-bold">
        {{ isRegister ? "Crear Cuenta" : "Bienvenidos a Adweb Online" }}
      </h3>

      <b-form @submit.prevent="isRegister ? registerUser() : loginUser()">
        <b-form-group label="Correo electrónico">
          <b-form-input v-model="email" type="email" required />
        </b-form-group>

        <b-form-group label="Contraseña">
          <b-form-input v-model="password" type="password" required />
        </b-form-group>

        <b-button type="submit" variant="primary" class="w-100 mt-3">
          {{ isRegister ? "Registrarse" : "Entrar" }}
        </b-button>
      </b-form>

      <div class="text-danger mt-3" v-if="error">{{ error }}</div>

      <div class="text-center mt-3">
        <small>
          {{ isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?" }}
          <b-link href="#" @click.prevent="toggleMode">
            {{ isRegister ? "Inicia sesión aquí" : "Regístrate aquí" }}
          </b-link>
        </small>
      </div>
    </b-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
const isRegister = ref(false);

const toggleMode = () => {
  error.value = "";
  isRegister.value = !isRegister.value;
};

const loginUser = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/shop");
  } catch {
    error.value = "Correo o contraseña incorrectos.";
  }
};

const registerUser = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    router.push("/shop");
  } catch (err) {
    if (err.code === "auth/email-already-in-use") error.value = "El correo ya está registrado.";
    else if (err.code === "auth/weak-password") error.value = "La contraseña debe tener al menos 6 caracteres.";
    else error.value = "Error al crear la cuenta.";
  }
};
</script>
