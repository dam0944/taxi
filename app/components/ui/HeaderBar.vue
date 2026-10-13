<script setup>
import logoUrl from "~/assets/images/logos/taxi-logo.png";
import en from "~/assets/icons/en.png";
import km from "~/assets/icons/km.png";

const props = defineProps({
  active: { type: String, default: "Overview" },
  dark: { type: Boolean, default: false },
  notifications: { type: Array, default: () => [] },
  logoutPending: { type: Boolean, default: false },
});
const emit = defineEmits(["select", "notice", "sign-out"]);
const { $gsap } = useNuxtApp();
const navItems = ["Overview", "Generate", "Reports", "Checklist"];
const navRef = ref(null);
const blobRef = ref(null);
const trailRef = ref(null);
const navReady = ref(false);
const previewTab = ref(null);
const gooFilterId = `nav-goo-${useId().replace(/:/g, "")}`;

let navAnimation;
let navObserver;
let motionPreference;

function moveNavBlob(immediate = false) {
  const nav = navRef.value;
  if (!nav || !$gsap) return;
  const item = previewTab.value || props.active;
  const button = [...nav.querySelectorAll("button")].find(
    (button) => button.dataset.tab === item
  );
  if (!button) {
    navReady.value = false;
    return;
  }
  const target = {
    x: button.offsetLeft,
    y: button.offsetTop,
    width: button.offsetWidth,
    height: button.offsetHeight,
    scaleX: 1,
    scaleY: 1,
  };
  navAnimation?.kill();
  const blobs = [blobRef.value, trailRef.value];
  if (immediate || !navReady.value || motionPreference?.matches) {
    $gsap.set(blobs, target);
  } else {
    const distance = Math.abs(target.x - Number($gsap.getProperty(blobRef.value, "x")));
    const stretch = Math.min((distance / target.width) * 0.22, 0.45);
    navAnimation = $gsap
      .timeline()
      .to(blobs, {
        scaleX: 1 + stretch,
        scaleY: 1 - stretch * 0.3,
        duration: 0.12,
        ease: "power2.out",
      })
      .to(blobRef.value, { ...target, duration: 0.48, ease: "back.out(1.5)" }, 0.04)
      .to(trailRef.value, { ...target, duration: 0.6, ease: "power3.out" }, 0.1);
  }
  navReady.value = true;
}

function previewNav(item) {
  previewTab.value = item;
  moveNavBlob();
}
function restoreNav() {
  const focused = navRef.value?.querySelector("button:focus-visible");
  previewNav(focused?.dataset.tab || null);
}
function onNavFocusOut(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) previewNav(null);
}
watch(
  () => props.active,
  () => {
    previewTab.value = null;
    nextTick(() => moveNavBlob());
  }
);
onMounted(() => {
  motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  navObserver = new ResizeObserver(() => moveNavBlob(true));
  navObserver.observe(navRef.value);
  navRef.value
    .querySelectorAll("button")
    .forEach((button) => navObserver.observe(button));
  moveNavBlob(true);
});
onBeforeUnmount(() => {
  navObserver?.disconnect();
  navAnimation?.kill();
});
const { locale, setLocale } = useI18n();
const languages = [
  { code: "en", name: "English", flag: en },
  { code: "km", name: "ខ្មែរ", flag: km },
];
const currentLanguage = computed(
  () => languages.find((language) => language.code === locale.value) || languages[0]
);
const notificationOpen = ref(false);
const languageOpen = ref(false);
function useDropdownAnimation(open) {
  const panel = ref(null);
  let tween;
  let animatedElement;
  watch(
    [open, panel],
    ([isOpen, section]) => {
      const element = section?.closest(".header-popup-container");
      if (element !== animatedElement) {
        tween?.kill();
        tween = null;
        animatedElement = element;
        if (element && $gsap) {
          tween = $gsap.fromTo(
            element,
            { opacity: 0, y: -8, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.36,
              ease: "back.out(1.15)",
              easeReverse: "power2.out",
              transformOrigin: "var(--reka-popover-content-transform-origin, top right)",
              paused: true,
            }
          );
        }
      }
      if (!tween) return;
      if (motionPreference?.matches) {
        tween.pause().progress(isOpen ? 1 : 0);
      } else if (isOpen) {
        tween.timeScale(1).play();
      } else {
        tween.timeScale(1.5).reverse();
      }
    },
    { flush: "post" }
  );
  onBeforeUnmount(() => tween?.kill());
  return panel;
}

const notificationPanel = useDropdownAnimation(notificationOpen);
const languagePanel = useDropdownAnimation(languageOpen);
const languagePending = ref(false);
const openedByHover = ref(false);

let hoverTimer;

function cancelHoverTimer() {
  clearTimeout(hoverTimer);
}

function hoverOpen(event, dropdown) {
  if (event.pointerType === "touch") return;
  cancelHoverTimer();
  hoverTimer = setTimeout(() => {
    openedByHover.value = true;
    notificationOpen.value = dropdown === "notifications";
    languageOpen.value = dropdown === "language";
  }, 100);
}

function hoverClose(event) {
  cancelHoverTimer();
  if (event?.currentTarget?.contains(document.activeElement) && !openedByHover.value)
    return;
  hoverTimer = setTimeout(() => {
    notificationOpen.value = false;
    languageOpen.value = false;
  }, 220);
}

function useClickOrKeyboard() {
  cancelHoverTimer();
  openedByHover.value = false;
}

function preventHoverFocus(event) {
  if (openedByHover.value) event.preventDefault();
}

function dropdownFocusOut(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) hoverClose();
}
onBeforeUnmount(cancelHoverTimer);

const readIds = ref([]);
const isUnread = (notification) =>
  !notification.read && !readIds.value.includes(notification.id);
const unreadCount = computed(() => props.notifications.filter(isUnread).length);

function readNotification(notification) {
  cancelHoverTimer();
  if (!readIds.value.includes(notification.id)) readIds.value.push(notification.id);
  emit("notice", notification.message || notification.title);
  notificationOpen.value = false;
}

function markAllRead() {
  readIds.value = props.notifications.map((notification) => notification.id);
}

async function selectLanguage(code) {
  cancelHoverTimer();
  languagePending.value = true;
  try {
    await setLocale(code);
    languageOpen.value = false;
  } catch {
    emit("notice", "Unable to change language. Please try again.");
  } finally {
    languagePending.value = false;
  }
}

watch(notificationOpen, (open) => {
  if (open) languageOpen.value = false;
});
watch(languageOpen, (open) => {
  if (open) notificationOpen.value = false;
});
</script>

<template>
  <header class="dashboard-header">
    <NuxtLink class="brand" to="/" aria-label="EM Admin home">
      <img class="brand-logo" :src="logoUrl" alt="Em" />
    </NuxtLink>
    <nav
      ref="navRef"
      class="top-nav"
      :class="{ 'nav-animated': navReady }"
      aria-label="Main navigation"
      @pointerleave="restoreNav"
      @focusout="onNavFocusOut"
    >
      <svg class="nav-filter" aria-hidden="true" width="0" height="0">
        <defs>
          <filter
            :id="gooFilterId"
            x="-50%"
            y="-100%"
            width="200%"
            height="300%"
            color-interpolation-filters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
            />
          </filter>
        </defs>
      </svg>
      <span
        class="nav-goo"
        :style="{ filter: `url(#${gooFilterId})` }"
        aria-hidden="true"
      >
        <span ref="trailRef" class="nav-blob nav-blob-trail" />
        <span ref="blobRef" class="nav-blob" />
      </span>
      <button
        v-for="item in navItems"
        :key="item"
        :data-tab="item"
        :aria-pressed="active === item"
        :class="{
          selected: active === item,
          'nav-preview': (previewTab || active) === item,
        }"
        @pointerenter="$event.pointerType !== 'touch' && previewNav(item)"
        @focus="previewNav(item)"
        @click="emit('select', item)"
      >
        {{ item }}
      </button>
    </nav>
    <div class="header-right">
      <div class="header-tools">
        <!-- Notification -->
        <UPopover
          v-model:open="notificationOpen"
          :content="{
            align: 'end',
            sideOffset: 12,
            onOpenAutoFocus: preventHoverFocus,
            onCloseAutoFocus: preventHoverFocus,
          }"
          :ui="{ content: 'header-popup-container' }"
        >
          <button
            class="notification-trigger"
            @pointerenter="hoverOpen($event, 'notifications')"
            @pointerleave="hoverClose"
            @pointerdown="useClickOrKeyboard"
            @keydown="useClickOrKeyboard"
            :aria-label="`Notifications, ${unreadCount} unread`"
          >
            <UiDashboardIcon name="bell" />
            <span class="notification-badge" aria-hidden="true">{{
              unreadCount > 99 ? "99+" : unreadCount
            }}</span>
          </button>
          <template #content>
            <section
              ref="notificationPanel"
              class="header-dropdown notifications-dropdown"
              @pointerenter="cancelHoverTimer"
              @pointerleave="hoverClose"
              @focusin="cancelHoverTimer"
              @focusout="dropdownFocusOut"
              :class="{ 'dark-dashboard': dark }"
              aria-label="Notifications"
            >
              <div class="dropdown-heading">
                <h2>
                  Notifications <span class="unread-count">{{ unreadCount }}</span>
                </h2>
                <button v-if="unreadCount" class="mark-read" @click="markAllRead">
                  Mark all read
                </button>
              </div>
              <div v-if="!notifications.length" class="notifications-empty">
                <span class="empty-notification-icon"
                  ><UiDashboardIcon name="bell"
                /></span>
                <strong>You’re all caught up</strong>
                <p>New notifications will appear here.</p>
              </div>
              <div v-else class="notification-list">
                <button
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="notification-item"
                  @click="readNotification(notification)"
                >
                  <span
                    class="notification-dot"
                    :class="{ unread: isUnread(notification) }"
                  />
                  <span
                    ><strong>{{ notification.title }}</strong
                    ><small>{{ notification.message }}</small
                    ><small v-if="notification.time">{{ notification.time }}</small></span
                  >
                </button>
              </div>
            </section>
          </template>
        </UPopover>
        <UPopover
          v-model:open="languageOpen"
          :content="{
            align: 'end',
            sideOffset: 12,
            onOpenAutoFocus: preventHoverFocus,
            onCloseAutoFocus: preventHoverFocus,
          }"
          :ui="{ content: 'header-popup-container' }"
        >
          <button
            class="language-trigger"
            @pointerenter="hoverOpen($event, 'language')"
            @pointerleave="hoverClose"
            @pointerdown="useClickOrKeyboard"
            @keydown="useClickOrKeyboard"
            :aria-label="`Language: ${currentLanguage.name}`"
          >
            <img
              class="language-flag"
              :src="currentLanguage.flag"
              alt=""
              width="24"
              height="16"
            />
            <span class="language-name">{{ currentLanguage.name }}</span>
            <UiDashboardIcon name="chevron" />
          </button>
          <template #content>
            <section
              ref="languagePanel"
              class="header-dropdown language-dropdown"
              @pointerenter="cancelHoverTimer"
              @pointerleave="hoverClose"
              @focusin="cancelHoverTimer"
              @focusout="dropdownFocusOut"
              :class="{ 'dark-dashboard': dark }"
              aria-label="Choose language"
            >
              <div class="dropdown-heading">
                <h2>Language</h2>
              </div>
              <button
                v-for="language in languages"
                :key="language.code"
                class="language-option"
                :class="{ 'language-selected': locale === language.code }"
                :aria-pressed="locale === language.code"
                :disabled="languagePending"
                @click="selectLanguage(language.code)"
              >
                <img
                  class="language-flag"
                  :src="language.flag"
                  alt=""
                  width="24"
                  height="16"
                />
                <span :lang="language.code">{{ language.name }}</span>
                <!-- <UiDashboardIcon v-if="locale === language.code" name="check" /> -->
              </button>
            </section>
          </template>
        </UPopover>
      </div>
      <div class="profile">
        <span class="avatar">AD</span>
        <div><strong>Administrator</strong><small>Workspace admin</small></div>
        <button aria-label="Sign out" :disabled="logoutPending" @click="emit('sign-out')">
          <UiDashboardIcon name="logout" />
        </button>
      </div>
    </div>
  </header>
</template>
