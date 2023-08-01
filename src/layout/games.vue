<template>
  <div class="var-App__header">
    {{ GameData }}
    <div>
      <div class="var-App__header--title">{{ item?.name }}</div>
      <div class="var-App__header--description">{{ item?.description || 'description' }}</div>
    </div>
    <div class="var-App__header--version">version: {{ item?.version }}</div>
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

const item = {
  name: 'Games',
  description: 'description',
  version: '1.0.0',
};
</script>
