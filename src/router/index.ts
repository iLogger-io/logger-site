import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import ElementUI from "element-ui";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import VerifyEmail from "../views/VerifyEmail.vue";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(VueRouter);
Vue.use(ElementUI);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup
  },
  {
    path: "/verifyemail",
    name: "VerifyEmail",
    component: VerifyEmail
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
