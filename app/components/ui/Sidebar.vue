<script setup>
const props = defineProps({
  dark: { type: Boolean, default: false },
  active: { type: String, default: "Overview" },
});
const emit = defineEmits(["update:dark", "select", "notice"]);
const menuItems = [
  { label: "Overview", icon: "grid" },
  { label: "Insights", icon: "spark" },
  { label: "Workflows", icon: "workflow" },
  { label: "Analytics", icon: "chart" },
  { label: "Inventory", icon: "box" },
  {
    label: "User Management",
    icon: "users",
    children: [
      { label: "All Users", icon: "users" },
      { label: "Roles & Permissions", icon: "settings" },
    ],
  },
  { label: "Schedule", icon: "calendar" },
  { label: "Settings", icon: "settings" },
];
const openMenu = ref("");
const { $gsap } = useNuxtApp();
const submenuPanels = shallowReactive(new Map());
const submenuAnimations = new Map();
function setSubmenuPanel(label, panel) {
  if (panel) {
    submenuPanels.set(label, panel);
  } else {
    submenuAnimations.get(label)?.kill();
    submenuAnimations.delete(label);
    submenuPanels.delete(label);
  }
}
watchEffect(
  () => {
    const currentMenu = openMenu.value;
    for (const [label, panel] of submenuPanels) {
      const element = panel.closest(".sidebar-popup-container");
      if (!element || !$gsap) continue;
      let tween = submenuAnimations.get(label);
      if (!tween) {
        const options = [...panel.querySelectorAll(".submenu-option")];
        tween = $gsap.timeline({ paused: true });
        tween.fromTo(
          element,
          { opacity: 0 },
          { opacity: 1, duration: 0.2, easeReverse: "power2.out" },
          0
        );
        options.forEach((option, index) => {
          tween.fromTo(
            option,
            { opacity: 0, x: -12, y: 0, scale: 0.96 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: "elastic.out(1, 0.5)",
              easeReverse: "power2.out",
            },
            index * 0.06
          );
        });
        submenuAnimations.set(label, tween);
      }
      const isOpen = currentMenu === label;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        tween.pause().progress(isOpen ? 1 : 0);
      } else if (isOpen) {
        tween.timeScale(1).play();
      } else {
        tween.timeScale(2.5).reverse();
      }
    }
  },
  { flush: "post" }
);
onBeforeUnmount(() => {
  submenuAnimations.forEach((tween) => tween.kill());
  submenuAnimations.clear();
});
const openedByHover = ref(false);
let closeTimer;
function isActive(item) {
  return (
    props.active === item.label ||
    item.children?.some((child) => child.label === props.active)
  );
}
function cancelClose() {
  clearTimeout(closeTimer);
}
function setOpen(label, open) {
  cancelClose();
  openMenu.value = open ? label : "";
}
function openOnHover(event, label) {
  if (event.pointerType === "touch") return;
  openedByHover.value = true;
  setOpen(label, true);
}
function scheduleClose() {
  cancelClose();
  closeTimer = setTimeout(() => {
    openMenu.value = "";
  }, 180);
}
function preventHoverFocus(event) {
  if (openedByHover.value) event.preventDefault();
}
function onFocusOut(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) scheduleClose();
}
function selectChild(label) {
  emit("select", label);
  setOpen("", false);
}
onBeforeUnmount(cancelClose);
</script>

<template>
  <aside class="sidebar" aria-label="Dashboard navigation">
    <div class="theme-tools">
      <button
        aria-label="Light theme"
        :aria-pressed="!dark"
        @click="emit('update:dark', false)"
      >
        <UiDashboardIcon name="sun" /></button
      ><button
        aria-label="Dark theme"
        :aria-pressed="dark"
        @click="emit('update:dark', true)"
      >
        <UiDashboardIcon name="moon" />
      </button>
    </div>
    <div class="side-main">
      <template v-for="item in menuItems" :key="item.label">
        <UPopover
          v-if="item.children"
          mode="hover"
          :close-delay="180"
          :open="openMenu === item.label"
          :content="{
            side: 'right',
            align: 'start',
            sideOffset: 8,
            collisionPadding: 12,
            onOpenAutoFocus: preventHoverFocus,
          }"
          :ui="{ content: 'sidebar-popup-container' }"
          @update:open="setOpen(item.label, $event)"
        >
          <button
            :aria-label="item.label"
            :aria-expanded="openMenu === item.label"
            :class="{ 'side-active': isActive(item) }"
            @pointerenter="openOnHover($event, item.label)"
            @pointerleave="scheduleClose"
            @pointerdown="openedByHover = false"
            @keydown="openedByHover = false"
          >
            <UiDashboardIcon :name="item.icon" />
          </button>
          <template #content>
            <div
              :ref="(panel) => setSubmenuPanel(item.label, panel)"
              class="sidebar-submenu"
              :class="{ 'dark-dashboard': dark }"
              @pointerenter="cancelClose"
              @pointerleave="scheduleClose"
              @focusin="cancelClose"
              @focusout="onFocusOut"
            >
              <p class="submenu-heading">{{ item.label }}</p>
              <nav :aria-label="item.label">
                <button
                  v-for="child in item.children"
                  :key="child.label"
                  class="submenu-option"
                  :class="{ 'submenu-selected': active === child.label }"
                  :aria-pressed="active === child.label"
                  @click="selectChild(child.label)"
                >
                  <UiDashboardIcon :name="child.icon" />
                  <span>{{ child.label }}</span>
                </button>
              </nav>
            </div>
          </template>
        </UPopover>
        <button
          v-else
          :title="item.label"
          :aria-label="item.label"
          :aria-pressed="isActive(item)"
          :class="{ 'side-active': isActive(item) }"
          @pointerenter="setOpen('', false)"
          @click="emit('select', item.label)"
        >
          <UiDashboardIcon :name="item.icon" />
        </button>
      </template>
    </div>
    <button
      class="help-button"
      aria-label="Help"
      @click="
        emit('notice', 'Need help? Ask a question in the business assistant panel.')
      "
    >
      <UiDashboardIcon name="help" />
    </button>
  </aside>
</template>
