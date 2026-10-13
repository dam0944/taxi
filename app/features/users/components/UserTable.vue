<script setup>
import { userName, userInitials, userStatus } from "~/features/users/display";
defineProps({ removePending: Boolean, users: { type: Array, default: () => [] } });
defineEmits(["select", "edit", "remove"]);
</script>

<template>
  <div class="overflow-auto rounded-xl border-0">
    <table
      class="w-full border-collapse border-0 bg-(--surface) text-left text-xs whitespace-nowrap"
    >
      <caption class="sr-only">
        User accounts
      </caption>
      <thead>
        <tr>
          <th
            scope="col"
            class="border-0! border-r! border-b! border-(--line)! bg-(--canvas) px-2.5! py-2! font-medium! last:border-r-0! last:text-center"
          >
            User
          </th>
          <th
            scope="col"
            class="border-0! border-r! border-b! border-(--line)! bg-(--canvas) px-2.5! py-2! font-medium! last:border-r-0! last:text-center"
          >
            Email
          </th>
          <th
            scope="col"
            class="border-0! border-r! border-b! border-(--line)! bg-(--canvas) px-2.5! py-2! font-medium! last:border-r-0! last:text-center"
          >
            Role
          </th>
          <th
            scope="col"
            class="border-0! border-r! border-b! border-(--line)! bg-(--canvas) px-2.5! py-2! font-medium! last:border-r-0! last:text-center"
          >
            Status
          </th>
          <th
            scope="col"
            class="border-0! border-r! border-b! border-(--line)! bg-(--canvas) px-2.5! py-2! font-medium! last:border-r-0! last:text-center"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          class="[&:not(:last-child)>td]:border-b!"
        >
          <td
            class="border-0! border-r! border-(--line)! px-2.5! py-2! font-normal! last:border-r-0! last:text-center"
          >
            <div class="flex items-center gap-2">
              <span class="user-avatar">{{ userInitials(user) }}</span>
              <div>
                <strong class="block font-medium">{{ userName(user) }}</strong
                ><small class="mt-0.75 block text-(--muted)">@{{ user.username }}</small>
              </div>
            </div>
          </td>
          <td
            class="border-0! border-r! border-(--line)! px-2.5! py-2! font-normal! last:border-r-0! last:text-center"
          >
            {{ user.email || "—" }}
          </td>
          <td
            class="border-0! border-r! border-(--line)! px-2.5! py-2! font-normal! last:border-r-0! last:text-center"
          >
            {{ user.role_name || "Unassigned" }}
          </td>
          <td
            class="border-0! border-r! border-(--line)! px-2.5! py-2! font-normal! last:border-r-0! last:text-center"
          >
            <span class="user-status" :class="`user-status-${user.status_id}`">{{
              userStatus(user)
            }}</span>
          </td>
          <td
            class="border-0! border-r! border-(--line)! px-2.5! py-2! font-normal! last:border-r-0! last:text-center"
          >
            <UsersUserActions
              compact
              :user="user"
              :remove-pending="removePending"
              @select="$emit('select', $event)"
              @edit="$emit('edit', $event)"
              @remove="$emit('remove', $event)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
