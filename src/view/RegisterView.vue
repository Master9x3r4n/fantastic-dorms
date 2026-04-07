<script setup>
	import { ref, computed } from 'vue';
	import { useRouter } from 'vue-router';
	import Divider from "@/components/divider/Divider.vue";
	import ProfileService from "../services/ProfileService";
	import PasswordToggleButton from "@/components/page-buttons/PasswordToggleButton.vue";
	const router = useRouter();

	/*
		just so you all know, i have never written js code until now.
		believe it. there isn't another excuse. okay thank you.
	*/

	const inputs = ref({
		fields: { username: "", password: "", confirm: "" },
		valids: { username: false, password: false, confirm: false, terms: false }
	});

	const isEmpty = (input) => { return input === "" || input === false; }
	const areFieldsValid = computed(() => {
		return Object.values(inputs.value?.valids).every(value => {return value === true});
	});
	
	const isValidUsername = (input) => {
		if (isEmpty(input)) {
			return !(inputs.value.valids['username'] = false);
		}

		let reg = /^[\w]{8,32}$/;
		return inputs.value.valids['username'] = reg.test(input);
	};

	const isValidPassword = (input) => {
		if (isEmpty(input)) {
			return !(inputs.value.valids['password'] = false);
		}

		// lmao
		// https://stackoverflow.com/questions/12090077/javascript-regular-expression-password-validation-having-special-characters
		let reg = /^(?=.*[0-9])(?=.*[!@#$%^&*_])[\w!@#$%^&*]{8,32}$/;
		return inputs.value.valids['password'] = reg.test(input);
	};

	const isValidConfirm = (input) => {
		if (isEmpty(input)) {
			return !(inputs.value.valids['confirm'] = false);
		}
		return inputs.value.valids['confirm'] = (inputs.value.fields['password'] === input);
	};

	const showPassword = ref(false);
	const togglePassword = () => {
		showPassword.value = !showPassword.value;
	};

	const processing = ref(false);
	const hasError = ref(false);
	const register = async () => {
		processing.value = true;
		hasError.value = false;

		const data = {
			username: inputs.value.fields.username,
			password: inputs.value.fields.password,
		};

		try {
			await ProfileService.create(data);
			await ProfileService.login({ username: data.username, password: data.password });
			await router.push('/settings');
		} catch (err) {
			console.error('An error occurred registering new Profile: ' + err.message);
			hasError.value = true;
		} finally {
			processing.value = false;
		}
	};
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
		<div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-[#121422] transition-colors duration-200">
			<div class="max-w-md w-full">
				<!-- Header -->
				<div class="mb-5 text-center lg:text-left">
					<h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Create an account</h2>
					<!-- <p class="text-slate-500 dark:text-slate-400 transition-colors">Fantastic homes are waiting for you!!!</p> -->
				</div>

				<!-- Form -->
				<form action="#" class="space-y-6" method="POST" @submit.prevent>
					<!-- Username -->
					<div>
						<label class="block text-base font-medium text-slate-900 dark:text-slate-300 mb-1 transition-colors" for="username">Username</label>
						<input
							class="w-full px-4 py-3 rounded-lg border-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-10"
							:class="isValidUsername(inputs.fields?.username) ? 'border-slate-200 dark:border-slate-700 bg-transparent' : 'border-red-400 bg-red-100 dark:bg-red-600/10'"
							id="username"
							name="username"
							placeholder="really_good_username"
							required
							type="text"
							maxlength="32"
							v-model="inputs.fields.username"
						/>
						<p class="mt-1.5 text-sm text-slate-900 dark:text-white transition-colors">Minimum of 8 characters, with only alphanumeric characters and underscores.</p>
					</div>

					<!-- Password -->
					<div>
						<label class="block text-base font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors" for="password">Password</label>
						<div class="relative">
							<input
								class="w-full px-4 py-3 rounded-lg border-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-10"
								:class="isValidPassword(inputs.fields?.password) ? 'border-slate-200 dark:border-slate-700 bg-transparent' : 'border-red-400 bg-red-100 dark:bg-red-600/10'"
								id="password"
								name="password"
								placeholder="••••••••"
								required
								:type="showPassword ? 'text' : 'password'"
								maxlength="32"
								v-model="inputs.fields.password"
							/>
							<PasswordToggleButton v-model="showPassword" />
						</div>
						<p class="mt-1.5 text-sm text-slate-900 dark:text-white transition-colors">Minimum of 8 characters, with at least one number and one symbol.</p>
					</div>

					<!-- Password Confirmation -->
					<div>
						<label class="block text-base font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors" for="password">Confirm password</label>
						<div class="relative">
							<input
								class="w-full px-4 py-3 rounded-lg border-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-10"
								:class="isValidConfirm(inputs.fields?.confirm) ? 'border-slate-200 dark:border-slate-700 bg-transparent' : 'border-red-400 bg-red-100 dark:bg-red-600/10'"
								id="password"
								name="password"
								placeholder="••••••••"
								required
								:type="showPassword ? 'text' : 'password'"
								maxlength="32"
								v-model="inputs.fields.confirm"
							/>
							<button
									@click="togglePassword"
									class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none"
									type="button"
							>
								<span class="material-symbols-outlined text-xl select-none">
									{{ showPassword ? 'visibility' : 'visibility_off' }}
								</span>
							</button>
						</div>
						<!-- <p class="mt-1.5 text-xs text-slate-400 dark:text-slate-500 transition-colors">Minimum 8 characters with at least one number.</p> -->
					</div>

					<!-- Terms Checkbox -->
					<div class="flex items-start">
						<div class="flex items-center h-5">
							<input
								class="h-4 w-4 text-[#355AFF] focus:ring-[#355AFF] border-slate-300 dark:border-slate-600 dark:bg-[#1E1E1E] rounded transition-all cursor-pointer accent-[#355AFF]"
								id="terms"
								name="terms"
								required
								type="checkbox"
								v-model="inputs.valids.terms"
							/>
						</div>
						<div class="ml-3 text-base">
							<label class="text-slate-600 dark:text-slate-400 cursor-pointer transition-colors" for="terms">
								I agree to the 
								<a 
								target = _blank
								class="text-[#355AFF] hover:underline font-medium" 
								href="https://www.merriam-webster.com/dictionary/common%20sense">Common Sense</a> and 
								<a 
								target = _blank
								class="text-[#355AFF] hover:underline font-medium" 
								href="https://www.merriam-webster.com/dictionary/common%20courtesy">Common Courtesy</a>.
							</label>
						</div>
					</div>

					<!-- Submit Button -->
					<button
						@click="register"
						class="w-full font-semibold py-3.5 px-4 rounded-lg transition-all transform active:scale-[0.99]"
						:class="areFieldsValid ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-[#355AFF]/20' : 'bg-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-white'"
						type="button"
						:disabled="!areFieldsValid || processing"
					>
						<div v-if="processing">
							Processing...
						</div>
						<div v-else>
							Create account
						</div>
					</button>

					<!-- Error -->
					<div v-if="hasError" class="text-center">
						<div class="text-sm text-red-500">
							An error occurred. Please try again later.
						</div>
					</div>

					<!-- Login Link -->
					<p class="text-center text-slate-600 dark:text-slate-400 text-sm transition-colors">
						Already have an account?
						<RouterLink to="/login">
							<a class="text-[#355AFF] hover:underline font-semibold" href="#">Login</a>
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