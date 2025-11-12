import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import ShopView from "../views/ShopView.vue";
import { auth } from "../firebase";

const routes = [
  { path: "/", name: "Login", component: LoginView },
  { path: "/shop", name: "Shop", component: ShopView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Proteger rutas que requieren autenticación
router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  if (to.meta.requiresAuth && !user) next("/");
  else next();
});

export default router;
