<script setup>
import RolesEmptyState from "~/features/roles/components/EmptyState.vue";

definePageMeta({ middleware: "auth" });
useHead({ title: "Roles | EM Admin" });
</script>

<template>
  <section class="roles-page">
    <UiPageHeader
      title="Role management"
      description="Organize workspace roles and access."
    />
    <RolesEmptyState disabled />
  </section>
</template>
