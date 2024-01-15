<script lang="ts" setup>
import { reactive, watch, computed, ref } from "vue";

const linkAry = [
  {
    name: "自轉正方體",
    link: "/",
  },
  {
    name: "歐拉角",
    link: "/euler",
  },
];
</script>

<template>
  <header class="bg-slate-200 flex">
    <router-link
      v-for="link in linkAry"
      :key="link.name"
      :to="link.link"
      class="ring-1 py-4 px-2 block"
    >
      {{ link.name }}</router-link
    >
  </header>
</template>

<style lang="scss" scoped></style>
