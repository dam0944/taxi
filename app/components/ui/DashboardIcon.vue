<script setup>
defineProps({ name: { type: String, default: "grid" } });
const paths = {
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  edit: "m16 3 5 5 M4 16 17 3a2.1 2.1 0 0 1 3 3L7 19l-4 1Z",
  trash: "M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7",
  refresh: "M20 7v5h-5 M4 17v-5h5 M6 7a7 7 0 0 1 12-1l2 2 M4 16l2 2a7 7 0 0 0 12-1",
  table: "M3 4h18v16H3Z M3 9h18 M3 14h18 M9 4v16",
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  sun:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1.5 1.5 M17.5 17.5L19 19 M5 19l1.5-1.5 M17.5 6.5L19 5",
  moon: "M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z",
  spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z M20 2v4 M18 4h4",
  chart: "M4 20V12h4v8 M10 20V8h4v12 M16 20V4h4v16",
  users:
    "M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M17 4a4 4 0 0 1 0 8 M22 21v-3a4 4 0 0 0-3-3.9",
  box: "m12 3 9 5-9 5-9-5Z M3 8v9l9 5 9-5V8 M12 13v9 M7.5 5.5l9 5",
  workflow:
    "M12 3v7 M5 14v-4h14v4 M5 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6 M19 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6 M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4",
  settings:
    "M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  search: "M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15 M16 16l5 5",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4",
  info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 11v6 M12 7v.1",
  filter: "M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M10 15v6",
  export: "M12 16V3 M7 8l5-5 5 5 M4 14v6h16v-6",
  download: "M12 3v13 M7 11l5 5 5-5 M4 17v4h16v-4",
  plus: "M12 5v14 M5 12h14",
  send: "m3 10 18-7-7 18-3-8Z M11 13 21 3",
  globe:
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M3 12h18 M12 3c-5 5-5 13 0 18 M12 3c5 5 5 13 0 18",
  mic: "M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0Z M5 10v2a7 7 0 0 0 14 0v-2 M12 19v3 M8 22h8",
  calendar: "M4 5h16v16H4Z M8 2v6 M16 2v6 M4 10h16",
  check: "M9 11l3 3 8-9 M20 12v8H4V4h11",
  chevron: "m6 9 6 6 6-6",
  more: "M12 4v.1 M12 12v.1 M12 20v.1",
  help: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5 M12 17v.1",
  logout: "M9 4H3v16h6 M8 12h13 M17 8l4 4-4 4",
};
</script>
<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] || paths.grid" />
  </svg>
</template>
