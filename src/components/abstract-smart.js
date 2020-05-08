import Abstract from "./abstract";

export default class AbstractSmart extends Abstract {
  recoverListeners() {
    throw new Error(`Abstract method not implemented: recoverListeners`);
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
