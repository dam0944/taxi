<script setup>
const { logout, logoutPending } = useAuth();
const error = ref("");
const dark = ref(false);
const active = ref("Overview");
const notice = ref("");
const route = useRoute();
watch(
  () => route.path,
  (path) => {
    active.value = path.startsWith("/users")
      ? "All Users"
      : path.startsWith("/roles")
      ? "Roles & Permissions"
      : "Overview";
  },
  { immediate: true }
);
function selectWorkspace(item) {
  if (item === "Roles & Permissions") {
    active.value = item;
    notice.value = "";
    return navigateTo("/roles");
  }
  if (item === "All Users") {
    active.value = item;
    notice.value = "";
    return navigateTo("/users");
  }
  if (item === "Overview") {
    notice.value = "";
    active.value = item;
    return navigateTo("/");
  }
  active.value = item;
  notice.value =
    item === "Overview"
      ? ""
      : `${item} workspace selected. Preview data is shown in the overview.`;
}
async function signOut() {
  try {
    await logout();
  } catch {
    error.value = "Unable to sign out. Please try again.";
  }
}
</script>
<template>
  <div class="dashboard-shell" :class="{ 'dark-dashboard': dark }">
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <UiHeaderBar
      :dark="dark"
      :active="active"
      :logout-pending="logoutPending"
      @select="selectWorkspace"
      @notice="notice = $event"
      @sign-out="signOut"
    />
    <UiSidebar
      v-model:dark="dark"
      :active="active"
      @select="selectWorkspace"
      @notice="notice = $event"
    />
    <UiMainContent>
      <p v-if="error || notice" class="dashboard-notice" role="status">
        {{ error || notice
        }}<button
          aria-label="Dismiss notification"
          @click="
            error = '';
            notice = '';
          "
        >
          ×
        </button>
      </p>
      <slot />
    </UiMainContent>
  </div>
</template>
