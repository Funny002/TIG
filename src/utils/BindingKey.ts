export class KeyBinding {
  constructor(element: HTMLElement) {
    element.addEventListener('keyup', this.onKeyUp.bind(this), true);
    element.addEventListener('keydown', this.onKeyDown.bind(this), true);
  }

  private onKeyDown(event: KeyboardEvent) {
    this.handleKeys(event);

  }

  private onKeyUp(event: KeyboardEvent) {
    console.log(event);
  }

  private handleKeys(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    console.log(event, key);
  }
}
