import Vue from "vue";
import VueRouter from "vue-router";
import { isUserLogged } from "@/services/security";

Vue.use(VueRouter);

// Containers
const MainContainer = () => import("@/components/DefaultContainer");

let route = function(path, name, componentPath, guest) {
  let c = () => import("@/" + componentPath);
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
      name: "Home",
      component: MainContainer,
      children: [
        route("login", "Login", "common/pages/Login", true),
        route("logout", "Logout", "common/pages/Logout"),
        route("dashboard", "Dashboard", "components/dashboard/Dashboard"),
        route("gestione", "Gestione Dispositivi", "components/pages/Setup"),
        route("statistiche", "Statistiche", "components/pages/Statistiche"),
        {
          path: "programmazione",
          name: "Programmazione",
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            route("termostato", "Termostato", "components/pages/TempProgramming"),
            route("luce", "Luce", "components/pages/LightProgramming"),
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
    next();
    // if (!isUserLogged()) {
    //   next({
    //     path: "/login",
    //     query: { redirect: to.fullPath },
    //   });
    // } else next();
  } else {
    next();
  }
});

export default router;
