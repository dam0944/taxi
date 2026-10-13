<script setup>
import backgroundImage from "../../assets/images/backgrounds/background-unavailable-5.png";

defineEmits(["home", "retry"]);
</script>

<template>
  <section
    class="relative isolate flex min-h-svh w-full box-border items-center justify-center bg-white px-[clamp(24px,6vw,96px)] py-12"
    aria-labelledby="service-unavailable-title"
  >
    <img
      v-if="backgroundImage"
      :src="backgroundImage"
      alt=""
      class="absolute inset-0 -z-20 h-full w-full object-cover object-right md:object-center"
    />
    <div
      v-if="backgroundImage"
      class="absolute inset-0 -z-10 bg-white/85 md:hidden"
      aria-hidden="true"
    />
    <div class="w-full max-w-120 text-center">
      <span
        class="block text-[clamp(80px,18vw,140px)] leading-none font-semibold tracking-[-0.06em] text-(--brand-primary,#16a34a)"
        aria-hidden="true"
        >503</span
      >
      <h1 id="service-unavailable-title" class="mt-6 mb-3 text-[26px] font-semibold">
        Service unavailable
      </h1>
      <p class="text-slate-500 leading-[1.7]">
        The service is temporarily unavailable or undergoing maintenance. Please try again
        later.
      </p>
      <button
        type="button"
        class="mt-7 mr-3 rounded-3xl border-0 bg-(--brand-primary,#16a34a) px-5.5 py-2.5 text-white hover:bg-green-700"
        @click="$emit('retry')"
      >
        Try again
      </button>
      <button
        type="button"
        class="mt-7 rounded-3xl border-0 bg-(--brand-primary,#16a34a) px-5.5 py-2.5 text-white hover:bg-green-700"
        @click="$emit('home')"
      >
        Back to home
      </button>
    </div>
  </section>
</template>
