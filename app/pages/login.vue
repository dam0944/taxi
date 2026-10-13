<script setup>
import { getApiError } from "~/utils/apiResponse";
import logoUrl from "~/assets/images/logos/taxi-logo.png";
import loginBackground from "~/assets/images/backgrounds/background-1.png";
import bannerBackground from "~/assets/images/backgrounds/taxi-background-loop-preview.gif";

definePageMeta({ layout: false });
useHead({ title: "Sign in | moovit Taxi" });

const { login, loginPending } = useAuth();
const username = ref("");
const password = ref("");
const showPassword = ref(false);
const error = ref("");

async function submit() {
  if (loginPending.value) return;
  error.value = "";
  if (!username.value.trim() || !password.value) {
    error.value = "Enter your username and password.";
    return;
  }

  try {
    await login(username.value, password.value);
    password.value = "";
    await navigateTo("/");
  } catch (failure) {
    const { status } = getApiError(failure);
    error.value = [400, 401, 422].includes(status)
      ? "Sign-in failed. Check your username and password."
      : "Unable to connect. Please try again shortly.";
  }
}
</script>

<template>
  <main
    class="flex min-h-svh flex-col items-center justify-center bg-[#f5faf7] bg-cover bg-center bg-no-repeat px-4 py-6 text-[#202020] min-[641px]:px-6 min-[641px]:py-10"
    :style="{ backgroundImage: `url(${bannerBackground})` }"
  >
    <div
      class="grid w-full max-w-110 grid-cols-1 overflow-hidden rounded-[20px] border border-[#e2eee6] bg-white shadow-[0_20px_70px_#14532d0d] min-[641px]:max-w-255 min-[641px]:grid-cols-2 min-[641px]:rounded-3xl"
    >
      <aside
        class="relative isolate hidden flex-col justify-center bg-(--brand-forest) px-7 py-9 text-white min-[641px]:flex min-[801px]:px-11 min-[801px]:py-14"
        aria-label="About EM Taxi"
      >
        <img
          :src="loginBackground"
          alt=""
          class="absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.12]"
          aria-hidden="true"
        />
        <div
          class="[&>h2]:mt-7 [&>h2]:mb-4.5 [&>h2]:text-[clamp(30px,3vw,40px)] [&>h2]:leading-[1.2] [&>h2]:tracking-[-1.2px] [&>p]:max-w-82.5 [&>p]:text-(--brand-mint) [&>p]:leading-[1.8]"
        >
          <span
            class="inline-flex items-center gap-2.25 text-[11px] font-semibold tracking-[2px] text-(--brand-highlight) [&>span]:size-1.75 [&>span]:rounded-full [&>span]:bg-(--brand-highlight)"
            ><span /> EM TAXI</span
          >
          <h2>Every booking.<br />Every taxi. One place.</h2>
          <p>
            Manage taxi bookings, track vehicles, and coordinate drivers across Cambodia.
          </p>
          <div
            class="mt-10 grid gap-5 text-[13px] [&>div]:flex [&>div]:items-center [&>div]:gap-3 [&_svg]:size-5 [&_svg]:text-(--brand-highlight)"
          >
            <div><UiDashboardIcon name="chart" /><span>Track taxi locations</span></div>
            <div>
              <UiDashboardIcon name="workflow" /><span>Manage bookings and trips</span>
            </div>
            <div>
              <UiDashboardIcon name="users" /><span>Coordinate your drivers</span>
            </div>
          </div>
        </div>
        <span class="mt-16 text-xs text-(--brand-highlight)"
          >Keep your fleet moving.</span
        >
      </aside>
      <section
        class="min-w-0 px-6 py-8 min-[641px]:px-7 min-[641px]:py-9 min-[801px]:px-13 min-[801px]:py-11"
        aria-labelledby="login-title"
      >
        <div
          class="mb-7 flex h-9 w-37.5 items-center justify-center overflow-hidden min-[641px]:mb-9 [&>img]:h-auto [&>img]:w-48 [&>img]:max-w-none [&>img]:shrink-0"
        >
          <img :src="logoUrl" alt="Em" />
        </div>
        <div
          class="[&>h1]:my-2.5 [&>h1]:text-[32px] [&>h1]:tracking-[-1px] [&>p]:text-[#69766e]"
        >
          <span
            class="text-[10px] font-semibold tracking-[1.6px] text-(--brand-forest)"
            >CAMBODIA TAXI BOOKING &amp; TRACKING</span
          >
          <h1 id="login-title">Welcome back</h1>
          <p>Sign in to manage bookings and track your taxis.</p>
        </div>
        <form
          class="mt-7.5 grid gap-5.5"
          :aria-busy="loginPending"
          @submit.prevent="submit"
        >
          <div>
            <label
              for="username"
              class="mb-2 block text-[13px] font-medium text-[#34473a]"
              >Username</label
            >
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              autocomplete="username"
              autocapitalize="none"
              :spellcheck="false"
              required
              :disabled="loginPending"
              :aria-invalid="error ? true : undefined"
              :aria-describedby="error ? 'login-error' : undefined"
              placeholder="Your username"
              class="w-full min-h-12 rounded-[10px] border border-[#dce7df] bg-[#fbfdfb] px-3.5 py-3 text-sm text-[#202020] placeholder:text-[#86938b] transition-[border-color,box-shadow] duration-180 focus-visible:outline-none! focus-visible:border-(--brand-primary) focus-visible:shadow-[0_0_0_3px_#16a34a18] aria-invalid:border-red-600 disabled:opacity-60"
            />
          </div>

          <div>
            <label
              for="password"
              class="mb-2 block text-[13px] font-medium text-[#34473a]"
              >Password</label
            >
            <div class="relative">
              <input
                id="password"
                v-model="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                :disabled="loginPending"
                :aria-invalid="error ? true : undefined"
                :aria-describedby="error ? 'login-error' : undefined"
                placeholder="Your password"
                class="w-full min-h-12 rounded-[10px] border border-[#dce7df] bg-[#fbfdfb] px-3.5 py-3 text-sm text-[#202020] placeholder:text-[#86938b] transition-[border-color,box-shadow] duration-180 focus-visible:outline-none! focus-visible:border-(--brand-primary) focus-visible:shadow-[0_0_0_3px_#16a34a18] aria-invalid:border-red-600 disabled:opacity-60 pr-16.5"
              />
              <button
                type="button"
                class="absolute inset-y-1.5 right-1.5 rounded-md px-2.5 text-xs font-medium text-[#69766e] hover:enabled:bg-(--brand-mint)! hover:enabled:text-(--brand-forest)!"
                :disabled="loginPending"
                :aria-pressed="showPassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                aria-controls="password"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? "Hide" : "Show" }}
              </button>
            </div>
          </div>

          <p
            v-if="error"
            id="login-error"
            role="alert"
            class="rounded-[10px] border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] text-red-700"
          >
            {{ error }}
          </p>

          <button
            type="submit"
            :disabled="loginPending"
            class="flex min-h-12 items-center justify-center gap-2.5 rounded-[10px] bg-(--brand-primary) px-4 py-3 text-sm font-semibold text-white transition-colors duration-180 hover:enabled:bg-(--brand-forest)! hover:enabled:text-white!"
          >
            <span
              v-if="loginPending"
              aria-hidden="true"
              class="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white [animation-duration:800ms] motion-reduce:animate-none"
            />
            {{ loginPending ? "Signing in…" : "Sign in" }}
          </button>
          <span class="sr-only" role="status">{{
            loginPending ? "Signing in…" : ""
          }}</span>
        </form>
        <p class="mt-7 border-t border-[#e2eee6] pt-6 text-center text-xs text-[#69766e]">
          Need access? Contact your fleet administrator.
        </p>
      </section>
    </div>
  </main>
</template>
