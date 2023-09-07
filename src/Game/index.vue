<template>
  <div class="var-Game">
    <var-error v-if="data.isError"/>
    <template v-else>
      <div class="var-Game__header">
        <div class="var-Game__header--icon" @click.stop="onRouter('/home')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" viewBox="0 0 16 16">
            <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
        </div>
        <div class="var-Game__header--avatar">
          <img :src="GameInfo.logo" alt="logo">
        </div>
        <div class="var-Game__header--body">
          <div class="var-Game__header--user">
            <div class="var-Game__header--name">{{ GameInfo.name }}</div>
            <template v-if="GameInfo.author">
              <span style="padding: 0 3px;">#</span>
              <div class="var-Game__header--author">{{ GameInfo.author }}</div>
            </template>
          </div>
          <div class="var-Game__header--description">{{ GameInfo.description }}</div>
        </div>
        <div class="var-Game__header--version">
          <div class="var-Game__header--version-text">version:</div>
          <div class="var-Game__header--version-value">{{ GameInfo.version }}</div>
        </div>
      </div>
      <div class="var-Game__body">
        <var-error v-if="!data.component"/>
        <component v-else :is="data.component"/>
      </div>
    </template>
  </div>
</template>

<script lang="ts"> export default { name: 'Docs' };</script>
<script setup lang="ts">
import VarError from '@modules/Error/index.vue';
//
import { computed, onMounted, reactive, watch, provide, markRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GameModules } from '@games/index.ts';

const route = useRoute();
const router = useRouter();

const data = reactive<any>({ isError: false, item: null, component: null });

const GameInfo = computed(() => (data.item || {}));

onMounted(initPageFile);
watch(route, initPageFile);

provide('theme', {
  block: 12,
  color: '#879372',
  active: '#000000',
  background: '#9ead86',
});

async function initPageFile() {
  try {
    const name = (route.params.name || '') as string;
    const item = GameModules[name];
    if (!item) return data.isError = true;
    data.item = item.config;
    data.component = markRaw(item.modules);
    document.title = `${ data.item.name }|${ window.__CONFIG__.title }`;
  } catch (e) {
    data.isError = true;
  }
}

function onRouter(path: string) {
  router.push({ path });
}
</script>

<style lang="scss" scoped src="./style.scss"/>
