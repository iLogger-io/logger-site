import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import VerifyEmail from "../views/VerifyEmail.vue";
import guest from "../middleware/guest";
import home from "../middleware/home";
import auth from "../middleware/auth";

Vue.use(VueRouter);
Vue.use(ElementUI);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      middleware: [auth],
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      middleware: [home],
    },
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    meta: {
      middleware: [guest],
    },
  },
  {
    path: "/verifyemail",
    name: "VerifyEmail",
    component: VerifyEmail,
    meta: {
      middleware: [guest],
    },
  },
  {
    path: "/about",
    name: "About",
    meta: {
      middleware: [guest],
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context: any, middleware: any, index: number) {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;

  return (...parameters: any) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});

export default router;
