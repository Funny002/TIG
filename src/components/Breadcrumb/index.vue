<template>
  <div class="var-Breadcrumb">
    <div class="var-Breadcrumb__item" v-for="item of breadcrumb">
      <div class="var-Breadcrumb__content" :class="{'is-router': item.router}" @click.stop="onRouter(item.router)">{{ item.name }}</div>
      <div class="var-Breadcrumb__separator">
        <slot name="separator">{{ props.separator }}</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">export default { name: 'VarBreadcrumb' };</script>
<script setup lang="ts">

import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const props = withDefaults(defineProps<{
  separator?: string;
  data: (string | { name: string; router: string })[]
}>(), {
  separator: '/',
  data: () => [],
});

const breadcrumb = computed(() => props.data.map(item => (typeof item === 'string' ? { name: item, router: '' } : item)));

function onRouter(path?: string) {
  if (!path) return false;
  router.push({ path });
}
</script>

<style lang="scss" src="./style.scss"/>
