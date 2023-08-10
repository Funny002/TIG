<template>
  <div class="var-GluttonousSnake" ref="root" tabindex="-1">
    <canvas ref="canvas"/>
  </div>
</template>

<script lang="ts">export default { name: 'Gluttonous Snake' };</script>
<script setup lang="ts">
// import { computed, onMounted, reactive, ref } from 'vue';
// import { createSnakeItem } from './utils/Snake.ts';
// import { KeyBinding } from '@utils/BindingKey';
// import { Create } from 'tig-core/src';
// const root = ref<HTMLDivElement>();
// const canvas = ref<HTMLCanvasElement>();
// const data = reactive<{
//   core: Create | null;
//   keyBinding: KeyBinding | null;
// }>({
//   core: null,
//   keyBinding: null,
// });
// const boxSize = computed(() => {
//   const { offsetWidth, offsetHeight } = root.value || { offsetWidth: 0, offsetHeight: 0 };
//   return { width: offsetWidth, height: offsetHeight };
// });
// onMounted(() => {
//   if (root.value) initKeyBinding(root.value);
//   if (canvas.value) initCreate(canvas.value);
// });
// function initKeyBinding(dom: HTMLDivElement) {
//   data.keyBinding = new KeyBinding(dom);
// }
// function initCreate(canvas: HTMLCanvasElement) {
//   // data.core = new Create(canvas, boxSize.value);
//   // data.core.run();
//   // for (let i = 0; i < 5; i++) {
//   //   const x = createSnakeItem(10, 50 - i * 10);
//   //   data.core.insert(x);
//   // }
// }
</script>

<style lang="scss">
.var-GluttonousSnake {
  width: 100%;
  height: 100%;
  outline: none;
}
</style>
