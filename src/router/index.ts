import { createRouter, createWebHistory } from "vue-router";
import Landing from "@/pages/Landing.vue";

const routes = [
  {
    path: "/",
    component: Landing,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    component: () => import("@/pages/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔐 Navigation Guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("auth_access_token_smartlight"); // or your custom logic

  if (to.meta.requiresAuth && !isLoggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
