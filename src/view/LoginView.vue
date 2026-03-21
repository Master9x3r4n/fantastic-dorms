<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import Divider from "@/components/divider/Divider.vue";
  import ProfileService from "../services/ProfileService";
	import PasswordToggleButton from "@/components/page-buttons/PasswordToggleButton.vue";
  const router = useRouter();

  // Form-related stuff
  // https://test-utils.vuejs.org/guide/essentials/forms
  const processing = ref(false);
  const invalid = ref(false);
  const form = ref({
    username: '',
    password: ''
  });

  const loginForm = ref(null);
  const isFormValid = ref(false);
  const checkFormValidity = () => {
    isFormValid.value = loginForm.value?.checkValidity();
  }

  const login = () => {
    processing.value = true;

    ProfileService.login({ 
      username: form.value.username, password: form.value.password 
    })
      .then(res => {
        console.log('Yippeeeeeeee');
        // i don't give a damn
        localStorage.setItem('USER', JSON.stringify(res.data));
        router.push('/');
      })
      .catch(error => {
        console.log(error);
        processing.value = false;
        invalid.value = true
      })
  }

  // State for password visibility toggle
  const showPassword = ref(false);
  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };
</script>

<template>
  <div class="flex min-h-screen bg-white dark:bg-[#121422] transition-colors duration-200 font-['Inter']">

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
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-[#121422] transition-colors duration-200">
      <div class="max-w-md w-full">

        <!-- Header -->
        <div class="mb-5 text-center lg:text-left">
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Log into your account</h2>
          <!-- <p class="text-slate-500 dark:text-slate-400 transition-colors">We're glad to have you back!</p> -->
        </div>

        <!-- Form -->
        <form ref="loginForm" action="#" class="space-y-6" method="POST" @submit.prevent="login" @input="checkFormValidity">
          <!-- Errors -->
          <div 
            class="bg-red-200 dark:bg-red-300 border-l-5 border-red-500 dark:border-red-900 p-3 rounded-r-lg"
            v-if="invalid"
          >
            <div class="flex flex-row gap-2">
              <span class="text-red-900 material-symbols-outlined text-xl select-none">error</span>
              <!-- <svg class="h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg> -->
              <p class="text-red-900">Invalid credentials</p>
            </div>
          </div>
          
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors" for="username">Username</label>
            <input
                class="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                id="username"
                name="username"
                placeholder="really_good_username"
                required
                type="text"
                v-model="form.username"
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
                  v-model="form.password"
              />
              <PasswordToggleButton v-model="showPassword" />
            </div>
            <!-- <p class="mt-1.5 text-xs text-slate-400 dark:text-slate-500 transition-colors">Minimum 8 characters with at least one number.</p> -->
          </div>

          <!-- Submit Button -->
          <!-- <RouterLink to="/">
            <button
                class="w-full bg-[#355AFF] hover:bg-[#2b4bcc] text-white font-semibold py-3.5 px-4 rounded-lg shadow-lg shadow-[#355AFF]/20 transition-all transform active:scale-[0.99]"
                type="submit"
            >
              Login
            </button>
          </RouterLink> -->
          <button
              :disabled="!isFormValid || processing"
              class="
                w-full bg-[#355AFF] hover:bg-[#2b4bcc] text-white 
                disabled:bg-gray-300 disabled:hover:bg-gray-200 disabled:dark:bg-gray-800 disabled:dark:hover:bg-gray-700 disabled:shadow-transparent
                font-semibold py-3.5 px-4 rounded-lg shadow-lg shadow-[#355AFF]/20 transition-all transform active:scale-[0.99]
              "
              type="submit"
          >
            <div v-if="!processing">
              Login
            </div>
            <div v-else>
              Processing...
            </div>
          </button>

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