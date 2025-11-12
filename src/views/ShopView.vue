<template>
  <div>
    <NavBar />

    <b-container class="mt-4 mb-5">
      <h2 class="mb-4 text-center text-white fw-bold">Catálogo de Cursos</h2>

      <!-- Cards de cursos -->
      <b-row>
        <b-col
          cols="12"
          md="4"
          v-for="(course, i) in products"
          :key="i"
          class="mb-4"
        >
          <b-card
            :title="course.name"
            :img-src="course.image"
            img-alt="Curso"
            img-top
            class="shadow-sm course-card"
          >
            <b-card-text>
              Precio: <strong>${{ course.price.toLocaleString() }} CLP</strong>
            </b-card-text>
            <b-button variant="success" class="w-100" @click="addToCart(course)">
              Agregar al carrito
            </b-button>
          </b-card>
        </b-col>
      </b-row>

      <!--  Carrito -->
      <div class="mt-5 text-center bg-light p-4 rounded shadow-sm">
        <h4 class="mb-3">Tu Carrito</h4>

        <b-table
          v-if="cart.length > 0"
          :items="cart"
          :fields="['name', 'price', 'acciones']"
          bordered
          small
          responsive
          class="mt-3"
        >
          <template #cell(price)="data">
            ${{ data.item.price.toLocaleString() }}
          </template>

          <template #cell(acciones)="data">
            <b-button
              size="sm"
              variant="danger"
              @click="removeFromCart(data.index)"
            >
              Quitar
            </b-button>
          </template>
        </b-table>

        <div v-else class="mt-3 text-muted">
          No hay cursos en tu carrito.
        </div>

        <div class="mt-4">
          <h5>Total: ${{ totalPrice.toLocaleString() }} CLP</h5>
          <b-button
            v-if="cart.length > 0"
            variant="danger"
            class="mt-2"
            @click="clearCart"
          >
            Vaciar carrito
          </b-button>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import NavBar from "../components/NavBar.vue";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const products = ref([
  {
    name: "Curso de Vue 3",
    price: 100000,
    image: "../src/assets/images/vue.jpg",
  },
  {
    name: "Curso de React",
    price: 100000,
    image:
      "../src/assets/images/react.jpg",
  },
  {
    name: "Curso de Angular",
    price: 100000,
    image:
      "../src/assets/images/angular.jpg",
  },
  {
    name: "Curso de Node.js",
    price: 100000,
    image:
      "../src/assets/images/node.jpg",
  },
  {
    name: "Curso de Firebase",
    price: 100000,
    image:
      "../src/assets/images/firebase.jpg",
  },
  {
    name: "Curso de Python",
    price: 100000,
    image:
      "../src/assets/images/python.jpg",
  },
]);

const cart = ref([]);
const userId = ref(null);
const totalPrice = computed(() =>
  cart.value.reduce((acc, item) => acc + item.price, 0)
);

// 🔹 Cargar carrito desde Firestore
const loadCart = async (uid) => {
  const userCartRef = doc(db, "carts", uid);
  const docSnap = await getDoc(userCartRef);
  if (docSnap.exists()) cart.value = docSnap.data().items || [];
  else cart.value = [];
};

// 🔹 Guardar carrito en Firestore
const saveCart = async () => {
  if (!userId.value) return;
  const userCartRef = doc(db, "carts", userId.value);
  await setDoc(userCartRef, { items: cart.value });
};

// 🔹 Agregar curso al carrito
const addToCart = (course) => {
  cart.value.push(course);
  saveCart();
};

// 🔹 Quitar curso individual
const removeFromCart = async (index) => {
  cart.value.splice(index, 1);
  await saveCart();
};

// 🔹 Vaciar carrito
const clearCart = async () => {
  cart.value = [];
  await saveCart();
};

// 🔹 Detectar usuario y cargar su carrito
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId.value = user.uid;
      loadCart(user.uid);
    }
  });
});
</script>

<style scoped>
.course-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.course-card:hover {
  transform: scale(1.03);
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2);
}
</style>
