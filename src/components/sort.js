import Abstract from "./abstract";

const SORT_TYPES = [
  `by default`,
  `by date`,
  `by rating`
];

export default class Sort extends Abstract {
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
}
