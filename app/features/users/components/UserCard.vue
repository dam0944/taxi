<script setup>
import { userName, userInitials, userStatus } from "~/features/users/display";
defineProps({ removePending: Boolean, user: { type: Object, required: true } });
defineEmits(["select", "edit", "remove"]);
</script>
<template>
  <article class="user-card">
    <div class="user-card-top">
      <span class="user-avatar">{{ userInitials(user) }}</span
      ><span class="user-status" :class="`user-status-${user.status_id}`">{{
        userStatus(user)
      }}</span>
    </div>
    <h2>{{ userName(user) }}</h2>
    <p class="user-handle">@{{ user.username }}</p>
    <dl>
      <div>
        <dt>Email</dt>
        <dd>{{ user.email || "—" }}</dd>
      </div>
      <div>
        <dt>Role</dt>
        <dd>{{ user.role_name || "Unassigned" }}</dd>
      </div>
    </dl>
    <UsersUserActions full-width compact :user="user" :remove-pending="removePending" @select="$emit('select', $event)" @edit="$emit('edit', $event)" @remove="$emit('remove', $event)" />
  </article>
</template>

<style scoped>
/* Layout is styled with Tailwind utilities in UserActions. */
</style>
