<template>
  <div class="var-App__side">
    <div class="var-menu">
      <div class="var-menu--item" v-for="item of GameRoutes">
        <div @click.stop="JumpRouter('/games/' + item.path)">{{ item.name }}</div>
      </div>
    </div>
  </div>
  <div class="var-App__body is-home">
    <router-view/>
  </div>
</template>

<script lang="ts">export default { name: 'Layout' };</script>

<script setup lang="ts">
import { GameRoutes } from '../router/routes';
import { useRouter } from 'vue-router';

const router = useRouter();

function JumpRouter(path: string) {
  router.push(path);
}
</script>
