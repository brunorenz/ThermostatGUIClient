import Vue from "vue";
import VueRouter from "vue-router";
import { isUserLogged } from "@/services/security";

Vue.use(VueRouter);

// Containers
const MainContainer = () => import("@/components/DefaultContainer");

let route = function(path, name, guest, componentPath) {
  let p = componentPath === undefined ? name : componentPath;
  let c = () => import("" + p);
  return {
    path,
    name,
    component: c,
    meta: {
      guest: guest === undefined ? false : guest,
    },
  };
};

let router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      name: "Home",
      component: MainContainer,
      children: [
        route("login", "Login", true, "@/common/pages/Login"),
        route("logout", "Logout", false, "@/common/pages/Logout"),
        route("dashboard", "Dashboard", false, "@/components/dashboard/Dashboard"),
        route("gestione", "Gestione Dispositivi", false, "@/components/pages/Setup"),
        route("statistiche", "Statistiche", false, "@/components/pages/Statistiche"),
        {
          path: "programmazione",
          name: "Programmazione",
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            route("termostato", "Termostato", false, "@/components/pages/TempProgramming"),
            route("luce", "Luce", false, "@/components/pages/LightProgramming"),
          ],
        },
      ],
    },
    route("/404", "NotFound", true),
    {
      path: "*",
      redirect: "404",
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.guest === false) {
    if (!isUserLogged()) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else next();
  } else {
    next();
  }
});

export default router;
