<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "info",
    validator: (value) => ["success", "error", "warning", "info"].includes(value),
  },
  message: { type: String, required: true },
  duration: { type: Number, default: 4500 },
});
const emit = defineEmits(["dismiss"]);
const titles = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Information",
};
let timeout;

function resetTimeout() {
  clearTimeout(timeout);
  if (props.message && props.duration > 0)
    timeout = setTimeout(() => emit("dismiss"), props.duration);
}

watch(() => [props.message, props.duration], resetTimeout, { immediate: true });
onBeforeUnmount(() => clearTimeout(timeout));
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <div
      v-if="message"
      class="ui-toast"
      :class="`ui-toast-${type}`"
      :role="type === 'error' ? 'alert' : 'status'"
      :aria-live="type === 'error' ? 'assertive' : 'polite'"
      aria-atomic="true"
    >
      <div class="ui-toast-copy">
        <strong>{{ titles[type] }}</strong>
        <p>{{ message }}</p>
      </div>
      <button type="button" aria-label="Dismiss notification" @click="emit('dismiss')">
        Close
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.ui-toast {
  position: fixed;
  z-index: 100;
  top: 1.25rem;
  right: 1.25rem;
  display: flex;
  width: min(26rem, calc(100vw - 2rem));
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.125rem;
  border: 1px solid currentColor;
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px rgb(15 23 42 / 12%);
}

.ui-toast-copy {
  min-width: 0;
}

.ui-toast strong {
  display: block;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.ui-toast p {
  margin: 0.25rem 0 0;
  overflow-wrap: anywhere;
  font-size: 0.875rem;
  line-height: 1.35rem;
}

.ui-toast button {
  flex: none;
  padding: 0.125rem 0;
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.ui-toast-success {
  color: #047857;
  background: #ecfdf5;
}

.ui-toast-error {
  color: #b91c1c;
  background: #fef2f2;
}

.ui-toast-warning {
  color: #b45309;
  background: #fffbeb;
}

.ui-toast-info {
  color: #1d4ed8;
  background: #eff6ff;
}

@media (max-width: 480px) {
  .ui-toast {
    top: 0.75rem;
    right: 0.75rem;
    width: calc(100vw - 1.5rem);
  }
}
</style>
