<script setup>
defineProps({
  search: String,
  status: String,
  sort: String,
  view: String,
  pending: Boolean,
});
defineEmits([
  "update:search",
  "update:status",
  "update:sort",
  "update:view",
  "create",
  "refresh",
  "filter",
  "reset",
]);
const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "1" },
  { label: "Inactive", value: "2" },
  { label: "Suspended", value: "3" },
  { label: "Deleted", value: "4" },
];
const sortOptions = [
  { label: "Newest first", value: "created_at:desc" },
  { label: "Oldest first", value: "created_at:asc" },
  { label: "Name A–Z", value: "name:asc" },
  { label: "Username A–Z", value: "username:asc" },
];
</script>
<template>
  <div class="users-toolbar">
    <div class="users-search-actions">
      <label class="users-search">
        <UiDashboardIcon name="search" />
        <input
          :value="search"
          type="search"
          placeholder="Search name, username or email…"
          aria-label="Search users"
          @keydown.enter="$emit('filter')"
          @input="$emit('update:search', $event.target.value)"
        />
      </label>
      <UsersUserSelect
        :model-value="status || 'all'"
        :items="statusOptions"
        label="Filter user status"
        @update:model-value="$emit('update:status', $event === 'all' ? '' : $event)"
      />
      <UsersUserSelect
        :model-value="sort"
        :items="sortOptions"
        label="Sort users"
        @update:model-value="$emit('update:sort', $event)"
      />
      <button
        class="pill users-filter-toggle users-apply-filter"
        :disabled="pending"
        @click="$emit('filter')"
      >
        <UiDashboardIcon name="filter" />
        Filter
      </button>
      <button
        type="button"
        class="pill users-filter-toggle users-reset-filter"
        :disabled="pending"
        @click="$emit('reset')"
      >
        <UiDashboardIcon name="refresh" />
        Reset filters
      </button>
    </div>
    <div class="users-toolbar-controls">
      <button type="button" class="pill primary" @click="$emit('create')">
        <UiDashboardIcon name="plus" /> Create user
      </button>

      <div class="users-view-switch" role="group" aria-label="User list view">
        <button
          :aria-pressed="view === 'table'"
          :class="{ selected: view === 'table' }"
          aria-label="Table view"
          @click="$emit('update:view', 'table')"
        >
          <UiDashboardIcon name="table" />
        </button>
        <button
          :aria-pressed="view === 'grid'"
          :class="{ selected: view === 'grid' }"
          aria-label="Grid view"
          @click="$emit('update:view', 'grid')"
        >
          <UiDashboardIcon name="grid" />
        </button>
      </div>
      <button
        class="pill primary users-refresh"
        :disabled="pending"
        @click="$emit('refresh')"
      >
        <UiDashboardIcon name="refresh" />
        Refresh
      </button>
    </div>
  </div>
</template>

<style scoped>
.users-apply-filter {
  background: var(--brand-forest);
  color: #fff;
  border: 1px solid var(--brand-forest);
}
.users-reset-filter {
  background: #475569;
  color: #fff;
  border: 1px solid #475569;
}
.users-apply-filter:disabled,
.users-reset-filter:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
