<script setup>
defineProps({ removePending: Boolean, users: { type: Array, default: () => [] } });
defineEmits(["select", "edit", "remove"]);
</script>
<template>
  <div class="users-grid">
    <UsersUserCard
      v-for="user in users"
      :key="user.id"
      :user="user" :remove-pending="removePending"
      @select="$emit('select', $event)"
      @edit="$emit('edit', $event)" @remove="$emit('remove', $event)"
    />
  </div>
</template>
