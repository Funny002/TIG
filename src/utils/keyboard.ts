// a, 'a+b', ['a', 'b']
type KeyboardKey = string | string[]

const KeyMap: { [key: number]: string } = {
  8: 'Backspace',
  9: 'Tab',
  13: 'Enter',
  16: 'Shift',
  17: 'Ctrl',
  18: 'Alt',
  20: 'CapsLock',
  27: 'Escape',
  32: 'Space',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  45: 'Insert',
  46: 'Delete',
  91: 'Meta',
  93: 'ContextMenu',
};

function KeycodeToKey(code: number) {
  // // A - Z
  // if (code >= 97 && code <= 122) return String.fromCharCode(code).toLowerCase();
  // a - z
  if (code >= 65 && code <= 90) return String.fromCharCode(code).toLowerCase();
  // F1 - F12
  if (code >= 112 && code <= 123) return `f${ code - 111 }`;
  // 0 - 9
  if (code >= 48 && code <= 57) return `${ code - 48 }`;
  // 特殊键
  return (KeyMap[code] || '').toLowerCase();
}

export class Keyboard {
  private element: HTMLElement;
  private keys: { [keys: string]: boolean } = {};
  private listeners: { [keys: string]: (() => void)[] } = {};

  constructor(element: HTMLElement) {
    this.element = element;
    // TODO: 绑定事件
    element.addEventListener('keyup', this.onKeyUp.bind(this));
    element.addEventListener('keydown', this.onKeyDown.bind(this));
    element.addEventListener('keypress', this.onKeyPress.bind(this));
    //
    Object.defineProperty(this, 'keys', { enumerable: false });
    Object.defineProperty(this, 'element', { enumerable: false });
    Object.defineProperty(this, 'listeners', { enumerable: false });
  }

  // TODO: 销毁
  public destroy() {
    this.element.removeEventListener('keyup', this.onKeyUp.bind(this));
    this.element.removeEventListener('keydown', this.onKeyDown.bind(this));
    this.element.removeEventListener('keypress', this.onKeyPress.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {
    const key = KeycodeToKey(event.keyCode || event.which);
    if (key) {
      this.keys[key] = true;
      this.emit();
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    const key = KeycodeToKey(event.keyCode || event.which);
    if (key) {
      delete this.keys[key];
      this.emit();
    }
  }

  private onKeyPress() {
    this.emit();
  }

  private emit() {
    for (const key of ['*', Object.keys(this.keys).sort().join('+')]) {
      for (const listener of (this.listeners[key] ?? [])) {
        listener();
      }
    }
  }

  private handlerListenerKey(key: KeyboardKey) {
    return (Array.isArray(key) ? key.sort().join('+') : key).toLowerCase();
  }

  on(key: KeyboardKey, listener: () => void) {
    const keys = this.handlerListenerKey(key);
    if (!this.listeners[keys]) {
      this.listeners[keys] = [listener];
    } else {
      this.listeners[keys].push(listener);
    }
  }

  off(key: KeyboardKey, listener: () => void) {
    const keys = this.handlerListenerKey(key);
    const listeners = this.listeners[keys];
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }
}
