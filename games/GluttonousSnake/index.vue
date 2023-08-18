<template>
  <div class="var-GluttonousSnake" ref="root" tabindex="1" autofocus>
    <canvas ref="canvas"/>
  </div>
</template>

<script lang="ts">export default { name: 'Gluttonous Snake' };</script>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Keyboard } from '@utils/keyboard.ts';
import { Snake } from './utils/Graphics.ts';
import { Create } from 'tig-core/src';

const root = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();
const data = reactive<{
  stop: boolean;
  core: Create | null;
  snake: Snake | null;
  keyBinding: Keyboard | null;
  timeout: NodeJS.Timeout | null;
}>({
  core: null,
  stop: true,
  snake: null,
  timeout: null,
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
  data.keyBinding = new Keyboard(dom);

  function setDirection(dir: 0 | 1 | 2 | 3) {
    return function () {
      data.snake && (data.snake.direction = dir);
    };
  }

  data.keyBinding.on('ArrowUp', setDirection(0));
  data.keyBinding.on('ArrowDown', setDirection(1));
  data.keyBinding.on('ArrowLeft', setDirection(2));
  data.keyBinding.on('ArrowRight', setDirection(3));
}

function initCreate(canvas: HTMLCanvasElement) {
  data.core = new Create(canvas, boxSize.value);
  data.core.on('FPS', console.log);
  data.stop = false;
  data.core.run();
  initSnake();
}

// =====================================================
function initSnake() {
  const { width, height } = boxSize.value;
  data.snake = new Snake(<Create>data.core, width, height);
  for (let i = 10; i > 0; i--) {
    data.snake.addChild(1, 1 + i);
  }
  data.snake.start();
  data.snake.on('crash', () => {
    console.log(data.core);
  });
}

// function StopToggleStatus() {
//   data.stop = !data.stop;
//   if (!data.stop) {
//     Run();
//   } else {
//     Stop();
//   }
// }
// // run
// function Run() {
//   if (data.stop) return false;
//   data.snake?.move();
//   data.timeout = setTimeout(Run, 140);
// }
// // stop
// function Stop() {
//   clearTimeout(<NodeJS.Timeout>data.timeout);
// }
</script>

<style lang="scss">
.var-GluttonousSnake {
  width: 100%;
  height: 100%;
  outline: none;
}
</style>
