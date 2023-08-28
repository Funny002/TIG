import { drawBlock } from '@games/utils/Graphics.ts';
import { GraphsCanvas, Shape } from 'tig-core';
import { randomNum } from '@utils/random.ts';

// TODO: 形状
type TetrisTypes = 'S' | 'Z' | 'L' | 'I' | 'O' | 'T' | 'J';

// TODO: 字典, 它是由于 4 * 4 的格子组成
export const TetrisMap: { [key in TetrisTypes]: { x: number; y: number }[][] } = {
  O: [
    [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
  ],
  I: [
    [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }],
    [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }],
    [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
    [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }],
  ],
  S: [
    [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
    [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 3 }],
    [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 3 }],
    [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 3 }],
  ],
  Z: [
    [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
    [{ x: 2, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 3 }],
    [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 3 }],
    [{ x: 1, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 0, y: 3 }],
  ],
  L: [
    [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 3 }],
    [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 0, y: 3 }],
    [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }],
    [{ x: 2, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
  ],
  J: [
    [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 3 }],
    [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
    [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }],
    [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 3 }],
  ],
  T: [
    [{ x: 1, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
    [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 3 }],
    [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 3 }],
    [{ x: 1, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 3 }],
  ],
};

// TODO: 图形形状
export class TetrisModel extends Shape {
  // TODO: 形状
  private readonly types: TetrisTypes;

  // TODO: 格子大小
  private readonly block: number;

  // TODO: 颜色
  private readonly color: string;

  // TODO: 宽度
  private readonly width: number;

  // TODO: 旋转
  private rotate: number = 0;

  constructor(type: TetrisTypes, block: number, color: string = '#000') {
    super();
    this.types = type;
    this.block = block;
    this.color = color;
    this.width = (block + 1) * 4;
    this.update();
  }

  // TODO: 大小
  get size() {
    const width = this.width;
    return { width, height: width };
  }

  // TODO: 余数
  get zee() {
    return this.types === 'O' ? 1 : 4;
  }

  // TODO: 获取子项
  getChildren(rotate: number | null = null) {
    rotate = (null == rotate ? this.rotate : rotate) % this.zee;
    return TetrisMap[this.types][rotate] || [];
  }

  // TODO: 设置旋转
  setRotate(rotate: number) {
    rotate = rotate % this.zee;
    this.rotate = rotate >= 0 ? rotate : 4 + rotate;
    this.update();
  }

  // TODO: 旋转 - 默认，右旋
  onRotate(right: boolean = true) {
    this.setRotate(this.rotate + (right ? 1 : -1));
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { block, color } = this;
    const children = this.getChildren();
    const BlockCanvas = new GraphsCanvas(block, block);
    drawBlock(BlockCanvas.context, block, 0, 0, color);
    //
    const newBlock = block + 1;
    for (const point of children) {
      ctx.drawImage(BlockCanvas.canvas, point.x * newBlock, point.y * newBlock);
    }
  }
}

// TODO: 获取随机的形状顺序
export function getBagShape(block: number, color: string = '#000') {
  const target = ['S', 'Z', 'L', 'I', 'O', 'T', 'J'];
  for (let i = 0; i <= 6; i++) {
    const index = randomNum(0, 6);
    target.unshift(target.splice(index, 1)[0]);
  }
  return target.map(type => new TetrisModel(<TetrisTypes>type, block, color));
}

// TODO: 随机形状
export function getSingleShape(block: number, color: string = '#000') {
  const target = ['S', 'Z', 'L', 'I', 'O', 'T', 'J'][randomNum(0, 6)];
  return new TetrisModel(<TetrisTypes>target, block, color);
}
