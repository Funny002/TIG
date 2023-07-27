export class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export abstract class Paths {
  public points: Array<Point> = []; // 锚点
  public dragged: boolean = false; // 拖拽
  // public enabled: boolean = true;  // 启用
  public visible: boolean = true; // 可见
  // public click: boolean = false; // 点击

  public addPoint(x: number, y: number) {
    this.points.push(new Point(x, y));
  }

  protected abstract draw(): void;

  remove() {
    if (this.parent) {
      this.parent.children.splice(this.parent.children.indexOf(this), 1);
    }
  }

  // 父节点
  get parent() {
    return this._parent;
  }

  set parent(parent: Paths) {
    this._parent = parent;
  }
}

export class Line extends Paths {
  draw() {
  }
}

export class Shape extends Paths {
  draw() {
  }
}

export class Graphics {
  children: Array<Paths>;

  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  addShape(shape: Paths) {
    this.children.push(shape);
    shape.parent = this;
  }
}
