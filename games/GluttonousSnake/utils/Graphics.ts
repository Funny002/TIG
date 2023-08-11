import { Create, Shape, Rect } from 'tig-core/src';

const boxSize = 10;

// TODO: 蛇
export class Snake {
  public speed: number = 2;
  private readonly core: Create;
  private children: Shape[] = [];
  private readonly width: number;
  private readonly height: number;
  // TODO: 方向 0: 上, 1: 下, 2: 左, 3: 右
  public direction: 0 | 1 | 2 | 3 = 0;

  constructor(core: Create, size: { width: number, height: number }) {
    this.core = core;
    this.width = Math.ceil(size.width / boxSize);
    this.height = Math.ceil(size.height / boxSize);
  }

  addChild(x: number, y: number) {
    const rect = new Rect(y * boxSize, x * boxSize, boxSize, boxSize);
    this.children.unshift(rect);
    this.core.insert(rect);
  }

  // TODO: 移动
  move() {
    const head = this.children[0];
    let [x, y] = [head.left / boxSize, head.top / boxSize];
    switch (this.direction) {
      case 0: { // 上
        y -= 1;
        y = y < 0 ? this.height - 1 : y;
        break;
      }
      case 1: { // 下
        y += 1;
        y = y >= this.height ? 0 : y;
        break;
      }
      case 2: { // 左
        x -= 1;
        x = x < 0 ? this.width - 1 : x;
        break;
      }
      case 3: { // 右
        x += 1;
        x = x >= this.width ? 0 : x;
        break;
      }
    }
    const foot = this.children.pop();
    foot?.remove();
    this.addChild(x, y);
  }
}
