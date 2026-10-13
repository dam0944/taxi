<script setup>
definePageMeta({ middleware: "auth" });
useHead({ title: "Users | EM Admin" });
import { storeToRefs } from "pinia";
import Loading from "~/components/Loading.vue";
import { useUsersStore } from "~/features/users/store";
import { userName, userInitials, userStatus } from "~/features/users/display";
const usersStore = useUsersStore();
const { $gsap } = useNuxtApp();
const viewAnimations = new Map();

function clearViewAnimation(element) {
  viewAnimations.get(element)?.kill();
  viewAnimations.delete(element);
  $gsap?.set([element, ...element.querySelectorAll('.user-card, tbody tr')], {
    clearProps: 'opacity,transform,transformOrigin',
  });
}

function animateView(element, done, entering) {
  clearViewAnimation(element);
  if (!$gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    done();
    return;
  }
  const items = element.querySelectorAll('.user-card, tbody tr');
  const timeline = $gsap.timeline({
    onComplete() {
      clearViewAnimation(element);
      done();
    },
  });
  viewAnimations.set(element, timeline);
  if (entering) {
    timeline.fromTo(element,
      { opacity: 0, scale: 0.96, y: 12, transformOrigin: 'center top' },
      { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' },
    );
    if (items.length) timeline.fromTo(items,
      { opacity: 0, y: 16, scale: 0.97, transformOrigin: 'center top' },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, stagger: { amount: 0.18 }, ease: 'power3.out' },
      0.08,
    );
  } else {
    timeline.to(element, {
      opacity: 0, scale: 0.97, y: -6, transformOrigin: 'center top',
      duration: 0.16, ease: 'power2.in',
    });
  }
}

function enterView(element, done) {
  animateView(element, done, true);
}
function leaveView(element, done) {
  animateView(element, done, false);
}
onBeforeUnmount(() => {
  for (const element of viewAnimations.keys()) clearViewAnimation(element);
});
const {
  users,
  page,
  perPage,
  total,
  totalPages,
  listPending,
  listError,
  removePending,
  removeError,
  search,
  status,
  sort,
  view,
  selectedUser,
} = storeToRefs(usersStore);
const { loadUsers, setPage, setPerPage } = usersStore;
const detailsOpen = ref(false);
const formOpen = ref(false);
const editingUser = ref(null);
const toast = ref(null);
let toastId = 0;
function showToast(type, message) {
  toast.value = { id: ++toastId, type, message };
}
function openCreate() {
  editingUser.value = null;
  formOpen.value = true;
}
function openEdit(user) {
  editingUser.value = user;
  detailsOpen.value = false;
  formOpen.value = true;
}
const rangeStart = computed(() =>
  total.value ? (page.value - 1) * perPage.value + 1 : 0
);
const rangeEnd = computed(() => Math.min(page.value * perPage.value, total.value));
async function safely(action) {
  try {
    await action();
  } catch {
    /* Errors are displayed from the controller. */
  }
}
function applyFilters() {
  return safely(usersStore.applyFilters);
}
onMounted(() => safely(loadUsers));
async function removeUser(user) {
  if (!window.confirm(`Remove ${userName(user)}? This cannot be undone.`)) return;
  try {
    await usersStore.removeUser(user.id);
    showToast("success", "User removed successfully.");
  } catch {
    showToast("error", removeError.value?.message || "Unable to remove user.");
  }
}
function showDetails(user) {
  selectedUser.value = user;
  detailsOpen.value = true;
}
</script>
<template>
  <section class="users-page">
    <UiPageHeader
      title="User management"
      description="View and find the people in your workspace."
    />
    <UsersUserToolbar
      v-model:search="search"
      v-model:status="status"
      v-model:sort="sort"
      v-model:view="view"
      :pending="listPending"
      @create="openCreate"
      @filter="applyFilters"
      @reset="safely(usersStore.resetFilters)"
      @refresh="safely(loadUsers)"
    />
    <UiToast
      v-if="toast"
      :key="toast.id"
      :type="toast.type"
      :message="toast.message"
      @dismiss="toast = null"
    />
    <UsersUserFormModal v-model:open="formOpen" :user="editingUser" @saved="showToast('success', $event)" />
    <div class="users-results" :aria-busy="listPending">
      <div v-if="listError" class="users-state users-error" role="alert">
        <h2>Unable to load users</h2>
        <p>{{ listError.message }}</p>
        <button class="pill primary" @click="safely(loadUsers)">Try again</button>
      </div>
      <div v-else-if="listPending" class="users-state users-loading-state">
        <Loading />
      </div>
      <UsersEmptyState v-else-if="!users.length" title="No users found" description="Create a user or adjust your filters." action-label="Create user" @action="openCreate" />
      <Transition
        v-else
        :css="false"
        mode="out-in"
        @enter="enterView"
        @leave="leaveView"
        @enter-cancelled="clearViewAnimation"
        @leave-cancelled="clearViewAnimation"
      >
        <UsersUserTable v-if="view === 'table'" key="table" :users="users" :remove-pending="removePending" @select="showDetails" @edit="openEdit" @remove="removeUser" />
        <UsersUserGrid v-else key="grid" :users="users" :remove-pending="removePending" @select="showDetails" @edit="openEdit" @remove="removeUser" />
      </Transition>
    </div>
    <div class="users-pagination">
      <p role="status">{{ rangeStart }}–{{ rangeEnd }} of {{ total }} users</p>
      <div>
        <div class="users-page-size">
          <span>Per page</span>
          <UsersUserSelect
            :model-value="String(perPage)"
            :items="[
              { label: '10', value: '10' },
              { label: '20', value: '20' },
              { label: '50', value: '50' },
            ]"
            label="Users per page"
            :disabled="listPending"
            @update:model-value="safely(() => setPerPage(Number($event)))"
          />
        </div>
        <button
          class="pill"
          :disabled="listPending || page <= 1"
          @click="safely(() => setPage(page - 1))"
        >
          Previous</button
        ><span>Page {{ page }} of {{ totalPages }}</span
        ><button
          class="pill"
          :disabled="listPending || page >= totalPages"
          @click="safely(() => setPage(page + 1))"
        >
          Next
        </button>
      </div>
    </div>
    <UModal
      v-model:open="detailsOpen"
      :ui="{
        content: 'max-w-lg rounded-2xl bg-white dark:bg-white text-gray-900 ring-1 ring-gray-200 shadow-xl',
        header: 'border-b border-gray-100 px-6 py-5',
        title: 'text-base font-semibold text-gray-900',
        description: 'text-sm text-gray-500',
        body: 'p-6',
        close: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
      }"
      title="User details"
      description="Account information for this workspace user."
    >
      <template #body
        ><div v-if="selectedUser" class="user-detail-panel">
          <div class="user-detail-heading">
            <span class="user-avatar">{{ userInitials(selectedUser) }}</span>
            <div>
              <h2>{{ userName(selectedUser) }}</h2>
              <p class="user-detail-handle">@{{ selectedUser.username }}</p>
            </div>
          </div>
          <dl>
            <div>
              <dt>Username</dt>
              <dd>{{ selectedUser.username }}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{{ selectedUser.email || "—" }}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{{ selectedUser.role_name || "Unassigned" }}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <span class="user-status" :class="`user-status-${selectedUser.status_id}`">
                  {{ userStatus(selectedUser) }}
                </span>
              </dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{{ selectedUser.created_at || "—" }}</dd>
            </div>
          </dl>
        </div>
      </template>
    </UModal>
  </section>
</template>

<style scoped>
.users-loading-state {
  border: 0;
}

.user-detail-panel {
  color: #202020;
}

.user-detail-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.user-detail-heading .user-avatar {
  width: 48px;
  height: 48px;
  margin: 0;
}

.user-detail-heading h2 {
  margin: 0;
  font-size: 20px;
  line-height: 1.4;
}

.user-detail-handle {
  margin-top: 4px;
  color: #64748b;
  font-size: 13px;
  overflow-wrap: anywhere;
}

.user-detail-panel dl {
  display: grid;
  gap: 0;
  margin: 0;
}

.user-detail-panel dl > div {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr);
  align-items: start;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.user-detail-panel dl > div:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.user-detail-panel dt {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.user-detail-panel dd {
  color: #202020;
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
