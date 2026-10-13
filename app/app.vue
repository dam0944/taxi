<script setup>
import faviconUrl from "~/assets/icons/em-favicon.svg?url";

useHead({
  link: [{ rel: "icon", type: "image/svg+xml", href: faviconUrl }],
});
</script>

<template>
  <div>
    <UApp>
      <NuxtRouteAnnouncer />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
