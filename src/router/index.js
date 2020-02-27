import Vue from "vue";
import Router from "vue-router";
// Component

Vue.use(Router);

// Containers
const DefaultContainer = () => import("@/components/DefaultContainer");

// Views
const Dashboard = () => import("@/components/dashboard/Dashboard");
const Setup = () => import("@/components/pages/Setup");
const TempProgramming = () => import("@/components/pages/TempProgramming");
const Login = () => import("@/components/pages/Login");
const Statistiche = () => import("@/components/pages/Statistiche");

let router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      name: "Home",
      component: DefaultContainer,
      children: [
        {
          path: "login",
          name: "Login",
          component: Login,
          meta: {
            guest: true
          }
        },
        {
          path: "dashboard",
          name: "Dashboard",
          component: Dashboard,
          meta: {
            guest: true
          }
        },
        {
          path: "gestione",
          name: "Gestione Dispositivi",
          component: Setup,
          meta: {
            auth: true
          }
        },
        {
          path: "statistiche",
          name: "Statistiche",
          component: Statistiche,
          meta: {
            guest: true
          }
        },
        {
          path: "programmazione",
          name: "Programmazione",
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "termostato",
              name: "Termostato",
              component: TempProgramming,
              meta: {
                auth: true
              }
            },
            {
              path: "luce",
              name: "Luce",
              meta: {
                auth: true
              }
            }
          ]
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    if (window.sessionStorage.getItem("jwt") === null) {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    } else {
      let user = JSON.parse(window.sessionStorage.getItem("user"));
      // if (to.matched.some(record => record.meta.is_admin)) {
      //   if (user.is_admin == 1) {
      //     next();
      //   } else {
      //     next({ name: "userboard" });
      //   }
      // } else {
      next();
      //}
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    next();
  } else {
    next();
  }
});
export default router;
