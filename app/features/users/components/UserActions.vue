<script setup>
import { userName } from "~/features/users/display";
defineProps({
  user: { type: Object, required: true },
  removePending: Boolean,
  compact: Boolean,
  iconOnly: Boolean,
  fullWidth: Boolean,
});
defineEmits(["select", "edit", "remove"]);
const actions = [
  { event: "select", label: "View", icon: "eye", color: "border-[#15803d] bg-[#15803d]" },
  { event: "edit", label: "Edit", icon: "edit", color: "border-[#2563eb] bg-[#2563eb]" },
  {
    event: "remove",
    label: "Remove",
    icon: "trash",
    color: "border-[#dc2626] bg-[#dc2626]",
  },
];
</script>
<template>
  <div
    class="items-center"
    :class="[
      fullWidth ? 'grid w-full grid-cols-3' : 'inline-flex',
      iconOnly
        ? 'flex-nowrap gap-1.5'
        : compact
        ? 'flex-wrap gap-1'
        : 'flex-wrap gap-1.5',
    ]"
  >
    <button
      v-for="action in actions"
      :key="action.event"
      type="button"
      class="inline-flex cursor-pointer items-center justify-center rounded-full border font-medium whitespace-nowrap text-white leading-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-primary) disabled:cursor-not-allowed disabled:opacity-50"
      :class="[
        action.color,
        iconOnly
          ? 'h-7.5 w-7.5 flex-[0_0_30px] p-0'
          : compact
          ? 'h-7.5 gap-1.25 px-2.5 py-0 text-[11px]'
          : 'h-9.5 gap-2 px-4 py-0 text-xs',
      ]"
      :aria-label="`${action.label} ${userName(user)}`"
      :disabled="removePending"
      @click="$emit(action.event, user)"
    >
      <UiDashboardIcon
        :name="action.icon"
        class="shrink-0"
        :class="compact ? 'size-3.5!' : 'size-4!'"
      />
      <span v-if="!iconOnly">{{ action.label }}</span>
    </button>
  </div>
</template>

<style scoped>
/* Keep the existing Vue style module valid during hot updates. */
</style>
