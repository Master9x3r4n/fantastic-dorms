import { createRouter, createWebHistory } from 'vue-router'
import ListingService from '../services/ListingService.js';
import AdminView from '../view/AdminView.vue'
import LandingView from '../view/LandingView.vue'
import PlaygroundView from '../view/PlaygroundView.vue'
import ListingView from '../view/ListingView.vue'
import ProfileView from '../view/ProfileView.vue'
import ReviewsView from '../view/ReviewsView.vue'
import SearchView from '../view/SearchView.vue'
import RegisterView from "@/view/RegisterView.vue";
import LoginView from "@/view/LoginView.vue";
import WriteView from "@/view/WriteView.vue";
import SettingsView from "@/view/SettingsView.vue";
import AccountCreationView from "@/view/AccountCreationView.vue";
import ListingSettingsView from "@/view/ListingSettingsView.vue";
import { useAuthStore } from '@/auth';
import AboutView from '@/view/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: LandingView,
      meta: { search: false, loggedIn: true },
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
      meta: {search: false},
      beforeEnter: async (to, from, next) => {
        const auth = useAuthStore();
        if (!auth.user)
          await auth.fetchCurrentUser();

        if (!auth.user)
          return next('/login');
        else
          return next();
      }
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { search: false, loggedIn: false },
      // beforeEnter: (to, from, next) => {
      //   const user = localStorage.getItem('USER');
      //   if (user && from.path !== '/register')
      //     return next('/');
      // }
      beforeEnter: async (to, from, next) => {
        const auth = useAuthStore();
        if (!auth.user)
          await auth.fetchCurrentUser();

        if (auth.user)
          return next('/');
        else
          return next();
      }
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { search: false, loggedIn: false },
    },
    {
      path: "/playground",
      name: "playground",
      component: PlaygroundView,
      meta: { search: true, loggedIn: true },
    },
    {
      path: "/search",
      name: "search",
      component: SearchView,
      meta: { search: true, loggedIn: true },
    },
    {
      path: "/listing",
      redirect: "/",
    },
    {
      path: "/listing/:id",
      name: "listing",
      component: ListingView,
      meta: { search: true, loggedIn: true },
      props: true,
    },
    {
      path: "/profile",
      redirect: "/",
    },
    {
      path: "/profile/:id",
      name: "profile",
      component: ProfileView,
      meta: { search: true, loggedIn: true },
      props: true,
    },
    {
      path: "/reviews",
      redirect: "/",
    },
    {
      path: "/reviews/:id",
      name: "reviews",
      component: ReviewsView,
      meta: { search: true, loggedIn: true },
      props: true,
    },
    {
      path: "/write",
      redirect: "/"
    },
    {
      path: "/write/:id",
      name: "write",
      component: WriteView,
      meta: { search: true, loggedIn: true },
      props: true,
      beforeEnter: async (to, from, next) => {
        const auth = useAuthStore();
        if (!auth.user)
          await auth.fetchCurrentUser();

        if (!auth.user)
          return next('/login');
        else
          return next();
      }
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
      meta: { search: false, loggedIn: true },
      props: true,
      beforeEnter: async (to, from, next) => {
        const auth = useAuthStore();
        if (!auth.user)
          await auth.fetchCurrentUser();

        if (!auth.user)
          return next('/login');
        else
          return next();
      }
    },
    {
      path: "/create-account",
      name: "create-account",
      component: AccountCreationView,
      meta: { search: false, loggedIn: false },
    },
    {
      path: "/listing-settings",
      redirect: "/"
    },
    {
      path: "/listing-settings/:id",
      name: "listing-settings",
      component: ListingSettingsView,
      meta: { search: false, loggedIn: true },
      props: true,
      beforeEnter: async (to, from, next) => {
        const auth = useAuthStore();
        if (!auth.user)
          await auth.fetchCurrntUser();

        if (!auth.user)
          return next('/login');
        else {
          // is there a better way xd
          const listing = await ListingService.find(from.params.id);
          // if (listing.ownerUsername === auth.user.username)
          if (listing.owner === auth.user.username)
            return next();
          else
            return next('/');
        }e
      }
    },
    {
      path: "/about-us",
      name: "about-us",
      component: AboutView,
      meta: { search: true, loggedIn: true },
    },
  ],
})

export default router;