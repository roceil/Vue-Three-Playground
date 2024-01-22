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
  {
    name: "光源",
    link: "/light",
  },
  {
    name: "紋理",
    link: "/textures",
  },
  {
    name: "字體",
    link: "/font",
  },
  {
    name: "射線",
    link: "/raycast",
  },
  {
    name: "太陽系",
    link: "/solarsystem",
  }
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
