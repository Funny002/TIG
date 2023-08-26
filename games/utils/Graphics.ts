import { Shape, GraphsCanvas } from 'tig-core';

// TODO: 绘制基础方块
function drawBlock(ctx: CanvasRenderingContext2D, block: number, left: number = 0, top: number = 0, color: string = '#849374') {
  ctx.lineWidth = 1;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  const newWidth = block - 4;
  ctx.strokeRect(left, top, block, block);
  ctx.roundRect(left + 2, top + 2, newWidth, newWidth, 1);
  ctx.fill();
}

// TODO: 游戏方块 - 创建 ·Shape· 子类
export class GameBlock extends Shape {
  protected color: string;
  protected readonly width: number;

  constructor(left: number, top: number, width: number, color: string = '#849374') {
    super();
    this.top = top;
    this.left = left;
    this.width = width;
    this.color = color;
    this.update();
  }

  get size() {
    const width = this.width;
    return { width, height: width };
  }

  // TODO: 改变颜色
  setColor(color: string) {
    this.color = color;
    this.update();
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawBlock(ctx, this.width, 0, 0, this.color);
  }
}

// TODO: 游戏背景 - 使用方块进行绘画
export class GameBackgroundBlock extends Shape {
  // TODO: 块
  protected readonly block: number;

  // TODO: 颜色
  protected readonly color: string;

  // TODO: 宽
  protected readonly width: number;

  // TODO: 高
  protected readonly height: number;

  constructor(width: number, height: number, block: number, color: string = '#849374') {
    super();
    this.block = block;
    this.color = color;
    this.width = width;
    this.height = height;
    this.selected = false;
    this.update();
  }

  // TODO: 大小
  get size() {
    return { width: this.width, height: this.height };
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { width, height, block, color } = this;
    const BlockCanvas = new GraphsCanvas(block, block);
    drawBlock(BlockCanvas.context, block, 0, 0, color);
    //
    const newBlock = block + 1;
    const newWidth = Math.ceil((width - block) / block);
    const newHeight = Math.ceil((height - block) / block);
    for (let left = 0; left < newWidth; left++) {
      for (let top = 0; top < newHeight; top++) {
        ctx.drawImage(BlockCanvas.canvas, left * newBlock, top * newBlock);
      }
    }
  }
}

// TODO: 游戏背景 - 使用线条进行绘画
export class GameBackgroundLine extends GameBackgroundBlock {
  constructor(width: number, height: number, block: number, color: string = '#849374') {
    super(width, height, block, color);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { width, height, block, color } = this;
    const newWidth = Math.ceil((width - block) / block);
    const newHeight = Math.ceil((height - block) / block);
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let left = 1; left < newWidth; left++) {
      ctx.moveTo(left * block + left - 0.5, 0);
      ctx.lineTo(left * block + left - 0.5, height);
    }
    for (let top = 1; top < newHeight; top++) {
      ctx.moveTo(0, top * block + top - 0.5);
      ctx.lineTo(width, top * block + top - 0.5);
    }
    ctx.stroke();
  }
}
