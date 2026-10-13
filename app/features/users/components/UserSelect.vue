<script setup>
defineProps({
  modelValue: { type: String, default: "" },
  items: { type: Array, required: true },
  label: { type: String, required: true },
  disabled: Boolean,
});
defineEmits(["update:modelValue"]);
const selectUi = {
  base: "users-select-trigger rounded-full ring-0",
  content: "users-select-menu rounded-xl shadow-none ring-0",
  item: "users-select-option",
  itemTrailingIcon: "hidden",
};
</script>
<template>
  <USelect
    :model-value="modelValue"
    :items="items"
    :aria-label="label"
    :disabled="disabled"
    portal=".dashboard-shell"
    :content="{ position: 'popper', sideOffset: 6, align: 'start' }"
    :ui="selectUi"
    variant="none"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #trailing><UiDashboardIcon name="chevron" /></template>
    <template #item-trailing="{ item }">
      <UiDashboardIcon v-if="item.value === modelValue" name="check" />
    </template>
  </USelect>
</template>
