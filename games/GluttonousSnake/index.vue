<template>
  <div class="var-GluttonousSnake" ref="root" tabindex="-1">
    <canvas ref="canvas"/>
  </div>
</template>

<script lang="ts">export default { name: 'Gluttonous Snake' };</script>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { KeyBinding } from '@utils/BindingKey';
import { Snake } from './utils/Graphics.ts';
import { Create } from 'tig-core/src';

const root = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();
const data = reactive<{
  stop: boolean;
  core: Create | null;
  snake: Snake | null;
  keyBinding: KeyBinding | null;
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
  data.keyBinding = new KeyBinding(dom);
}

function initCreate(canvas: HTMLCanvasElement) {
  data.core = new Create(canvas, boxSize.value);
  data.core.on('FPS', console.log);
  data.stop = false;
  data.core.run();
  initSnake();
  Run();
  // for (let i = 0; i < 5; i++) {
  //   const x = createSnakeItem(10, 50 - i * 10);
  //   data.core.insert(x);
  // }
}

// =====================================================
function initSnake() {
  const snake = data.snake = new Snake(<Create>data.core, boxSize.value);
  data.snake.addChild(0, 2);
  data.snake.addChild(0, 1);
  data.snake.addChild(0, 0);

  root.value?.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp': {
        snake.direction = 0;
        break;
      }
      case 'ArrowDown': {
        snake.direction = 1;
        break;
      }
      case 'ArrowLeft': {
        snake.direction = 2;
        break;
      }
      case 'ArrowRight': {
        snake.direction = 3;
        break;
      }
    }
  });
}

function StopToggleStatus() {
  data.stop = !data.stop;
  if (!data.stop) {
    Run();
  } else {
    Stop();
  }
}

// run
function Run() {
  if (data.stop) return false;
  data.snake?.move();
  data.timeout = setTimeout(Run, 100);
}

// stop
function Stop() {
  clearTimeout(<NodeJS.Timeout>data.timeout);
}

</script>

<style lang="scss">
.var-GluttonousSnake {
  width: 100%;
  height: 100%;
  outline: none;
}
</style>
