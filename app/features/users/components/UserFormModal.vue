<script setup>
import { useUsersStore } from "~/features/users/store";
import { getApiError } from "~/utils/apiResponse";

const props = defineProps({ open: Boolean, user: { type: Object, default: null } });
const emit = defineEmits(["update:open", "saved"]);
const store = useUsersStore();
const editing = computed(() => Boolean(props.user));
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const ready = ref(false);
const roles = ref([]);
const statuses = ref([]);
const form = reactive({
  first_name: "",
  last_name: "",
  user_name: "",
  email: "",
  role_id: "",
  status_id: "1",
  password: "",
  password_confirm: "",
});
const fields = [
  { key: "first_name", label: "First name", autocomplete: "given-name" },
  { key: "last_name", label: "Last name", autocomplete: "family-name" },
  { key: "user_name", label: "Username", autocomplete: "off" },
  { key: "email", label: "Email", type: "email", autocomplete: "email" },
];
const inputClass = "user-form-control";
const roleOptions = computed(() =>
  roles.value.map((role) => ({ label: role.role_name, value: String(role.id) }))
);
const statusOptions = computed(() =>
  statuses.value.map((status) => ({ label: status.name, value: String(status.id) }))
);
const selectUi = {
  base: "user-form-control user-form-select",
  content: "user-form-select-menu",
  item: "user-form-select-option",
};
let version = 0;
async function loadForm() {
  const current = ++version;
  loading.value = true;
  ready.value = false;
  error.value = "";
  Object.assign(form, {
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    role_id: "",
    status_id: "1",
    password: "",
    password_confirm: "",
  });
  try {
    const data = editing.value
      ? await store.updateForm(props.user.id)
      : await store.createForm();
    if (current !== version) return;
    const defaults = data?.users?.[0];
    if (!defaults || !Array.isArray(defaults.roles) || !Array.isArray(defaults.status))
      throw new Error("Unable to load user form options.");
    roles.value = defaults.roles;
    statuses.value = defaults.status;
    for (const key of ["first_name", "last_name", "user_name", "email"])
      form[key] = defaults[key] ?? "";
    form.role_id = roles.value.some(
      (role) => Number(role.id) === Number(defaults.role_id)
    )
      ? String(defaults.role_id)
      : "";
    form.status_id = String(defaults.status_id || 1);
    ready.value = true;
  } catch (failure) {
    if (current === version) error.value = getApiError(failure).message;
  } finally {
    if (current === version) loading.value = false;
  }
}
watch(
  () => [props.open, props.user?.id],
  () => {
    if (props.open) loadForm();
    else {
      version++;
      form.password = "";
      form.password_confirm = "";
    }
  },
  { immediate: true }
);
onBeforeUnmount(() => {
  version++;
});
function setOpen(open) {
  if (!saving.value) emit("update:open", open);
}
async function submit() {
  if (!ready.value || loading.value || saving.value) return;
  error.value = "";
  if (!editing.value && form.password !== form.password_confirm) {
    error.value = "Passwords do not match.";
    return;
  }
  if (!editing.value && new TextEncoder().encode(form.password).length > 72) {
    error.value = "Password must be at most 72 bytes.";
    return;
  }
  const body = Object.fromEntries(
    fields.map((field) => [field.key, form[field.key].trim()])
  );
  if (Object.values(body).some((value) => !value)) {
    error.value = "Please complete all required fields.";
    return;
  }
  if (
    !roles.value.some((role) => String(role.id) === form.role_id) ||
    !statuses.value.some((status) => String(status.id) === form.status_id)
  ) {
    error.value = "Please select a role and status.";
    return;
  }
  body.role_id = Number(form.role_id);
  body.status_id = Number(form.status_id);
  const id = props.user?.id;
  if (!editing.value)
    Object.assign(body, {
      password: form.password,
      password_confirm: form.password_confirm,
    });
  saving.value = true;
  try {
    const result = id ? await store.updateUser(id, body) : await store.createUser(body);
    if (!result) throw new Error("Your session changed. Please sign in again.");
    emit("saved", id ? "User updated successfully." : "User created successfully.");
    emit("update:open", false);
  } catch (failure) {
    error.value = getApiError(failure).message;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <UModal
    :open="open"
    :title="editing ? 'Edit user' : 'Create user'"
    :description="
      editing
        ? 'Update account information and access.'
        : 'Add a new account to your workspace.'
    "
    :dismissible="!saving"
    :close="!saving"
    :ui="{
      content: 'max-w-xl rounded-2xl bg-white dark:bg-white text-gray-900',
      header: 'px-6 py-5 border-gray-100',
      title: 'text-lg font-semibold text-gray-900',
      description: 'mt-1 text-sm text-gray-500',
      close: 'text-gray-500',
      body: 'p-6',
    }"
    @update:open="setOpen"
  >
    <template #body>
      <p v-if="loading" role="status" class="py-8 text-center text-gray-500">
        Loading user form…
      </p>
      <form v-else class="space-y-5" :aria-busy="saving" @submit.prevent="submit">
        <p
          v-if="error"
          role="alert"
          class="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {{ error }}
        </p>
        <template v-if="ready">
          <fieldset :disabled="saving" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label v-for="field in fields" :key="field.key" class="user-form-field">
              {{ field.label }}
              <input
                v-model="form[field.key]"
                :type="field.type || 'text'"
                :autocomplete="field.autocomplete"
                :class="inputClass"
                required
              />
            </label>
            <label class="user-form-field"
              >Role
              <USelect
                v-model="form.role_id"
                :items="roleOptions"
                placeholder="Select a role"
                aria-label="Role"
                name="role_id"
                :disabled="saving"
                :portal="false"
                :content="{ position: 'popper', sideOffset: 6 }"
                :ui="selectUi"
                variant="none"
                required
              >
                <template #trailing><UiDashboardIcon name="chevron" /></template>
              </USelect>
            </label>
            <label class="user-form-field"
              >Status
              <USelect
                v-model="form.status_id"
                :items="statusOptions"
                aria-label="Status"
                name="status_id"
                :disabled="saving"
                :portal="false"
                :content="{ position: 'popper', sideOffset: 6 }"
                :ui="selectUi"
                variant="none"
                required
              >
                <template #trailing><UiDashboardIcon name="chevron" /></template>
              </USelect>
            </label>
            <template v-if="!editing">
              <label class="user-form-field"
                >Password
                <input
                  v-model="form.password"
                  type="password"
                  autocomplete="new-password"
                  minlength="6"
                  maxlength="72"
                  :class="inputClass"
                  required
                />
              </label>
              <label class="user-form-field"
                >Confirm password
                <input
                  v-model="form.password_confirm"
                  type="password"
                  autocomplete="new-password"
                  minlength="6"
                  maxlength="72"
                  :class="inputClass"
                  required
                />
              </label>
            </template>
          </fieldset>
        </template>
        <div class="flex justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            class="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium disabled:opacity-50"
            :disabled="saving"
            @click="setOpen(false)"
          >
            Cancel
          </button>
          <button
            v-if="!ready"
            type="button"
            class="user-form-submit rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white"
            @click="loadForm"
          >
            Try again
          </button>
          <button
            v-else
            type="submit"
            class="user-form-submit rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
            :disabled="saving || !roles.length || !statuses.length"
          >
            {{ saving ? "Saving…" : editing ? "Save changes" : "Create user" }}
          </button>
        </div>
      </form>
    </template>
  </UModal>
</template>

<style scoped>
.user-form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
}
:deep(.user-form-control) {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  color: #111827;
  font-size: 14px;
  font-weight: 400;
  box-shadow: none;
  transition: border-color 0.15s, background-color 0.15s, box-shadow 0.15s;
}
:deep(.user-form-control:focus-visible),
:deep(.user-form-select[data-state="open"]) {
  outline: none;
  border-color: #16a34a;
  background: #fff;
  box-shadow: 0 0 0 3px #dcfce7;
}
:deep(.user-form-select) {
  padding-right: 36px;
  text-align: left;
}
:deep(.user-form-select:hover:not(:disabled)) {
  background: #f3f4f6;
  color: #111827;
}
:deep(.user-form-control:disabled) {
  opacity: 0.5;
}
:deep(.user-form-select-menu) {
  background: #fff;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 4px;
  box-shadow: 0 8px 24px rgb(17 24 39 / 0.1);
}
:deep(.user-form-select-option) {
  padding: 9px 10px;
  border-radius: 6px;
  color: #374151;
  font-size: 14px;
}
:deep(.user-form-select-option::before) {
  display: none;
}
:deep(.user-form-select-option[data-highlighted]),
:deep(.user-form-select-option[data-state="checked"]) {
  background: #f0fdf4;
  color: #166534;
}
.user-form-submit:hover:not(:disabled) {
  background: #166534;
  color: #fff;
}
</style>
