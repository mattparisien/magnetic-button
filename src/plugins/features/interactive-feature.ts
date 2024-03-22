import { IInteractiveFeature } from "../interfaces";

function InteractiveFeature<T extends new (...args: any[]) => {}>(Base: T) {
  return class extends Base implements IInteractiveFeature {
    element: HTMLElement;
    clientX: number;
    clientY: number;

    constructor(...args: any[]) {
      super(...args);

      this.element = args[0];

      // Ensure the element is indeed an HTMLElement
      if (!(this.element instanceof HTMLElement)) {
        throw new Error("First argument must be an HTMLElement");
      }

      // Bind event handlers to ensure 'this' context is preserved when called as event listeners
      this.onMouseEnter = this.onMouseEnter.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);

      this.addEventListeners();
    }

    addEventListeners(): void {
      this.element.addEventListener("mouseenter", this.onMouseEnter);
      this.element.addEventListener("mouseleave", this.onMouseLeave);
      this.element.addEventListener("mousemove", this.onMouseMove);
    }

    removeEventListeners(): void {
      this.element.removeEventListener("mouseenter", this.onMouseEnter);
      this.element.removeEventListener("mouseleave", this.onMouseLeave);
      this.element.removeEventListener("mousemove", this.onMouseMove);
    }

    onMouseEnter(event: MouseEvent): void {
    }

    onMouseLeave(event: MouseEvent): void {
    }

    onMouseMove(event: MouseEvent): void {
      this.clientX = event.clientX;
      this.clientY = event.clientY;
    }

    // Ensure to call removeEventListeners when the plugin or feature is destroyed
    destroy(): void {
      this.removeEventListeners();
      console.log("Interactive feature destroyed and listeners removed.");
    }
  };
}

export default InteractiveFeature;
