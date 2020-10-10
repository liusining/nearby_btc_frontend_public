import Vue from "vue";
import VueRouter from "vue-router";
import Explore from "../views/Explore.vue";
import Me from "../views/Me.vue";
import Transparency from "../views/Transparency.vue";
import FAQ from "../views/FAQ.vue";
import GrabbedEnvelopes from "../views/GrabbedEnvelopes.vue";
import CreatedEnvelopes from "../views/CreatedEnvelopes.vue";
import NewSession from "../views/NewSession.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Explore",
    component: Explore,
    // alias: "/packets",
  },
  {
    path: "/newSession",
    name: "NewSession",
    component: NewSession,
  },
  {
    path: "/me",
    name: "Me",
    // route level code-splitting
    // this generates a separate chunk (me.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "me" */ "../views/Me.vue"),
    component: Me, // NOTE: not using lazy-loading as this page is little sized
  },
  {
    path: "/me/created",
    name: "CreatedEnvelopes",
    component: CreatedEnvelopes,
  },
  {
    path: "/me/grabbed",
    name: "GrabbedEnvelopes",
    component: GrabbedEnvelopes,
  },
  {
    path: "/me/transparency",
    name: "Transparency",
    component: Transparency,
  },
  {
    path: "/me/faq",
    name: "FAQ",
    component: FAQ,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
