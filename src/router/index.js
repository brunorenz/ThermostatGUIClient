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
//const RBUSServices = () => import("@/components/rbus/RBUSServices");
//const HTTPServices = () => import("@/components/http/HTTPServices");

//const Setup = () => import("@/components/Setup");

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      name: "Home",
      component: DefaultContainer,
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: Dashboard
        },
        {
          path: "gestione",
          name: "Gestione Dispositivi",
          component: Setup
        },
        {
          path: "statistiche",
          name: "Statistiche"
          //component: Statistics
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
              component: TempProgramming
            },
            {
              path: "luce",
              name: "Luce"
            }
          ]
        }
      ]
    }
  ]
});
