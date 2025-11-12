<template>
  <b-navbar variant="sucess" bg="white">
    <b-container>
      <b-navbar-brand href="#"> Cursos Disponibles</b-navbar-brand>

      <b-navbar-nav class="ms-auto align-items-center">
        <b-badge variant="danger" class="me-3" v-if="cartCount > 0">
           {{ cartCount }}
        </b-badge>
        <b-nav-item disabled>{{ userEmail }}</b-nav-item>
        <b-button variant="primary" size="sm" @click="logoutUser">Cerrar sesión</b-button>
      </b-navbar-nav>
    </b-container>
  </b-navbar>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const router = useRouter();
const userEmail = ref("");
const cartCount = ref(0);

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userEmail.value = user.email;

      // Escuchar cambios del carrito en tiempo real
      const cartRef = doc(db, "carts", user.uid);
      onSnapshot(cartRef, (docSnap) => {
        if (docSnap.exists()) cartCount.value = docSnap.data().items?.length || 0;
        else cartCount.value = 0;
      });
    } else router.push("/");
  });
});

const logoutUser = async () => {
  await signOut(auth);
  router.push("/");
};
</script>
