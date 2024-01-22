import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/euler",
      name: "euler",
      component: () => import("../views/EulerView.vue"),
    },
    {
      path: "/light",
      name: "light",
      component: () => import("../views/LightView.vue"),
    },
    {
      path: "/textures",
      name: "textures",
      component: () => import("../views/TexturesView.vue"),
    },
    {
      path: "/font",
      name: "font",
      component: () => import("../views/FontView.vue"),
    },
    {
      path: "/raycast",
      name: "raycast",
      component: () => import("../views/RaycastView.vue"),
    },
    {
      path: "/solarsystem",
      name: "solarsystem",
      component: () => import("../views/SolarSystemView.vue"),
    }
  ],
});

export default router;
