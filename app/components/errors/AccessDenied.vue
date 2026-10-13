<script setup>
import backgroundImage from "../../assets/images/backgrounds/backround-acc-4.png";

defineEmits(["home"]);
</script>

<template>
  <section
    class="relative isolate flex min-h-svh w-full box-border items-center justify-center bg-white px-[clamp(24px,6vw,96px)] py-12"
    aria-labelledby="access-denied-title"
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
        >403</span
      >
      <h1 id="access-denied-title" class="mt-6 mb-3 text-[26px] font-semibold">
        Access denied
      </h1>
      <p class="text-slate-500 leading-[1.7]">
        You don’t have permission to view this page. Contact your administrator if you
        need access.
      </p>
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
