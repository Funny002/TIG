<template>
  <div class="var-App__header">
    <div>
      <div class="var-App__header--title">{{ GameData?.name }}</div>
      <div class="var-App__header--description">{{ GameData?.description || 'description' }}</div>
    </div>
    <div class="var-App__header--version">version: {{ GameData?.version }}</div>
  </div>
  <div class="var-App__body is-game">
    <router-view/>
  </div>
</template>

<script lang="ts">export default { name: 'LayoutGames' };</script>

<script setup lang="ts">
import { GameRoutes } from '../router/routes';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const GameData = computed(() => GameRoutes.find(item => '/games/' + item.path === route.path));
</script>

<style lang="scss">
.var-App__body.is-game {
  --background: #9bad89;
  background: var(--background);
}
</style>
