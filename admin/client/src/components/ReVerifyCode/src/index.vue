<script setup lang="ts">
import { getVerifyCode } from "@/api/user";
import { useEpThemeStoreHook } from "@/store/modules/epTheme";
import { sleep } from "@/utils/sleep";
import { onMounted, onUnmounted, ref } from "vue";

let loading = ref(false);
const container = ref<HTMLDivElement>(null);
const svgContent = ref("");
const epTheme = useEpThemeStoreHook();

const ubSubscribe = epTheme.$subscribe((mutation, state) => {
  getCode();
});

async function getCode() {
  if (loading.value) {
    return;
  }
  loading.value = true;
  const containerDom = container.value;
  if (!containerDom) return;
  await sleep(500);
  const width = containerDom.offsetWidth;
  const height = containerDom.offsetHeight;
  const res = await getVerifyCode(
    width,
    height,
    "login",
    epTheme.epTheme === "light" ? "#ffffff" : "#121212"
  );
  svgContent.value = res.data;
  loading.value = false;
}

onMounted(() => {
  getCode();
});

onUnmounted(() => {
  ubSubscribe();
});
</script>

<template>
  <div
    ref="container"
    v-loading="loading"
    class="w-full h-full"
    @click="getCode"
    v-html="svgContent"
  />
</template>

<style lang="scss" scoped></style>
