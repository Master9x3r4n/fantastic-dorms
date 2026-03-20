<script setup>
import { ref } from 'vue';
import Divider from "@/components/divider/Divider.vue";
import PasswordToggleButton from "@/components/page-buttons/PasswordToggleButton.vue";

// State for password visibility toggle
const showPassword = ref(false);
</script>

<template>
  <div class="flex min-h-screen bg-white dark:bg-[#111111] transition-colors duration-200 font-['Inter']">

    <!-- Left Side -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient p-12 flex-col justify-center text-white relative overflow-hidden">
      <div class="relative z-10 max-w-xl">
        <h1 class="text-6xl leading-tight mb-6">
          We find homes <span class="italic underline font-bold">fantastic</span> for you!
        </h1>
        <p class="text-2xl max-w-md leading-relaxed">
          Join thousands of students finding the perfect place to live near campus. Rated by students, for students.
        </p>
      </div>
      <!-- Decorative Blur -->
      <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-[#355AFF]/20 rounded-full blur-3xl"></div>
    </div>

    <!-- Right Side: Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-[#111111] transition-colors duration-200">
      <div class="max-w-md w-full">

        <!-- Header -->
        <div class="mb-10 text-center lg:text-left">
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Login</h2>
          <p class="text-slate-500 dark:text-slate-400 transition-colors">We're glad to have you back!</p>
        </div>

        <!-- Form -->
        <form action="#" class="space-y-6" method="POST" @submit.prevent>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors" for="email">Email Address</label>
            <input
                class="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                id="email"
                name="email"
                placeholder="you@university.edu"
                required
                type="email"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors" for="password">Password</label>
            <div class="relative">
              <input
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-10"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
              />
              <PasswordToggleButton v-model="showPassword" />
            </div>
            <p class="mt-1.5 text-xs text-slate-400 dark:text-slate-500 transition-colors">Minimum 8 characters with at least one number.</p>
          </div>

          <!-- Submit Button -->
					<div>
          	<RouterLink to="/">
          	<button
          	    class="w-full bg-[#355AFF] hover:bg-[#2b4bcc] text-white font-semibold py-3.5 px-4 rounded-lg shadow-lg shadow-[#355AFF]/20 transition-all transform active:scale-[0.99]"
          	    type="submit"
          	>
          	  Login
          	</button>
          	</RouterLink>
					</div>

          <p class="text-center text-slate-600 dark:text-slate-400 text-sm transition-colors">
            Don't have an account?
            <RouterLink to="/register">
            <a class="text-[#355AFF] hover:underline font-semibold" href="#">Create one</a>
            </RouterLink>
          </p>
        </form>

        <!-- Footer -->
        <div class="mt-12 pt-8 text-center lg:text-left transition-colors">
          <Divider></Divider>
          <p class="text-xs text-slate-400 dark:text-slate-500 transition-colors">© 2025 Fantastic Dorms. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');


.bg-gradient {
  background: linear-gradient(-90deg, rgba(0, 0, 0, 0) 0%, #355AFF 27.7%);
}
</style>