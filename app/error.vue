<script setup>
import NotFound from "./components/errors/NotFound.vue";
import InternalServerError from "./components/errors/InternalServerError.vue";
import AccessDenied from "./components/errors/AccessDenied.vue";
import ServiceUnavailable from "./components/errors/ServiceUnavailable.vue";

const props = defineProps({ error: { type: Object, required: true } });
const isNotFound = computed(() => Number(props.error.statusCode) === 404);
const isAccessDenied = computed(() => Number(props.error.statusCode) === 403);
const isServiceUnavailable = computed(() => Number(props.error.statusCode) === 503);
const isServerError = computed(() => Number(props.error.statusCode) >= 500);

useHead({
  title: () =>
    isAccessDenied.value
      ? "Access denied | EM Admin"
      : isServiceUnavailable.value
      ? "Service unavailable | EM Admin"
      : isNotFound.value
      ? "Page not found | EM Admin"
      : isServerError.value
      ? "Internal server error | EM Admin"
      : "Something went wrong | EM Admin",
});
function goHome() {
  return clearError({ redirect: "/" });
}
function retry() {
  return reloadNuxtApp({ force: true });
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-[#f5faf7] text-[#202020]">
    <NotFound v-if="isNotFound" @home="goHome" />
    <AccessDenied v-else-if="isAccessDenied" @home="goHome" />
    <ServiceUnavailable v-else-if="isServiceUnavailable" @home="goHome" @retry="retry" />
    <InternalServerError v-else-if="isServerError" @home="goHome" />
    <section v-else class="px-6 py-8 text-center" aria-labelledby="error-title">
      <h1 id="error-title" class="text-[26px] font-semibold">Something went wrong</h1>
      <p class="mt-3 mb-6 text-slate-500">
        Please try again or return to your workspace.
      </p>
      <button
        type="button"
        class="rounded-3xl border-0 bg-green-600 px-5.5 py-2.5 text-white"
        @click="goHome"
      >
        Back to home
      </button>
    </section>
  </main>
</template>
