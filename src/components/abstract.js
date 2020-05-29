import {createElement} from "../util/dom-util";

const HIDDEN_CLASS = `visually-hidden`;

const RenderPosition = {
  AFTER_END: `afterend`,
  BEFORE_END: `beforeend`
};

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(`AbstractComponent method not implemented: getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  render(container, place = RenderPosition.BEFORE_END) {
    switch (place) {
      case RenderPosition.AFTER_END:
        container.prepend(this.getElement());
        break;
      case RenderPosition.BEFORE_END:
        container.append(this.getElement());
        break;
    }
  }

  remove() {
    this.getElement().remove();
    this.removeElement();
  }

  show() {
    if (this._element) {
      this._element.classList.remove(HIDDEN_CLASS);
    }
  }

  hide() {
    if (this._element) {
      this._element.classList.add(HIDDEN_CLASS);
    }
  }
}
