import {createElement} from "../util/dom-util";

const SORT_TYPES = [
  `by default`,
  `by date`,
  `by rating`
];

export default class Sort {
  constructor() {
    this._element = null;
  }

  _getSortItems() {
    return SORT_TYPES.map((type) =>
      `<li><a href="#" class="sort__button sort__button--active">Sort ${type}</a></li>`
    ).join(`\n`);
  }

  getTemplate() {
    return (
      `<ul class="sort">
        ${this._getSortItems()}
      </ul>`
    );
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
}
