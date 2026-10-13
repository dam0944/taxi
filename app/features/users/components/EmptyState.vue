<script setup>
defineProps({
  title: { type: String, default: "No users yet" },
  description: {
    type: String,
    default: "Get started by adding your first user.",
  },
  actionLabel: { type: String, default: "Add user" },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["action"]);
</script>

<template>
  <section
    :aria-label="title"
    class="flex w-full flex-col items-center justify-center px-6 py-16 text-center sm:py-20"
  >
    <div aria-hidden="true" class="mb-6 flex w-40 max-w-full flex-col gap-2.5">
      <div class="h-4.5 rounded bg-gray-300/70 dark:bg-gray-600/70" />
      <div class="h-4.5 rounded bg-gray-300/50 dark:bg-gray-600/50" />
      <div class="h-4.5 rounded bg-gray-300/30 dark:bg-gray-600/30" />
      <div class="h-4.5 rounded bg-gray-300/10 dark:bg-gray-600/10" />
    </div>

    <div class="max-w-md" aria-live="polite" aria-atomic="true">
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
        {{ title }}
      </h3>

      <p
        v-if="description"
        class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400"
      >
        {{ description }}
      </p>
    </div>

    <button
      v-if="actionLabel"
      type="button"
      :disabled="disabled"
      class="mt-5 inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-full bg-[#15803D] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#15803D]"
      @click="emit('action')"
    >
      <svg
        class="h-4.5 w-4.5 shrink-0"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v8M6 10h8" />
      </svg>
      <span>{{ actionLabel }}</span>
    </button>
  </section>
</template>
