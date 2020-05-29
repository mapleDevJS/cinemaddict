import AbstractComponent from "./abstract";

export default class AbstractSmartComponent extends AbstractComponent {
  recoverListeners() {
    throw new Error(`AbstractComponent method not implemented: recoverListeners`);
  }

  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.recoverListeners();
  }
}
