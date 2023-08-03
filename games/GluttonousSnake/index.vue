<template>
  <div class="var-GluttonousSnake" ref="root" tabindex="-1">
    <canvas ref="canvas"/>
  </div>
</template>

<script lang="ts">export default { name: 'Gluttonous Snake' };</script>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { KeyBinding } from '@utils/BindingKey';
import { CreateCollision } from 'tig-core';

const root = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();

const data = reactive<{
  core: CreateCollision | null;
  keyBinding: KeyBinding | null;
}>({
  core: null,
  keyBinding: null,
});
const boxSize = computed(() => {
  const { offsetWidth, offsetHeight } = root.value || { offsetWidth: 0, offsetHeight: 0 };
  return { width: offsetWidth, height: offsetHeight };
});

onMounted(() => {
  if (root.value) initKeyBinding(root.value);
  if (canvas.value) initCreate(canvas.value);
});

function initKeyBinding(dom: HTMLDivElement) {
  data.keyBinding = new KeyBinding(dom);
}

function initCreate(canvas: HTMLCanvasElement) {
  data.core = new CreateCollision(canvas, boxSize.value);
}
</script>

<style lang="scss" src="./style.scss"/>
