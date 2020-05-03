import Abstract from "./abstract";

export const SORT_TYPES = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export default class Sort extends Abstract {
  constructor() {
    super();

    this._typeChangeHandler = null;
    this._currentSortType = `DEFAULT`;
  }

  _getSortItem(key, value) {
    return (
      `<li>
        <a href="#" data-sort-type="${key}" class="sort__button ${this._currentSortType === key ? `sort__button--active` : ``}">
          Sort by ${value}
        </a>
      </li>`
    );
  }

  _getSortMarkup() {
    return Object.keys(SORT_TYPES).map((key) => {
      return this._getSortItem(key, SORT_TYPES[key]);
    })
    .join(`\n`);
  }

  getTemplate() {
    return (
      `<ul class="sort">
        ${this._getSortMarkup()}
      </ul>`
    );
  }

  getElement() {
    const element = super.getElement();
    element.addEventListener(`click`, this._handleClick);
    return element;
  }

  _getSortType(evt) {
    return evt.target.dataset.sortType;
  }

  _handleClick(evt) {
    evt.preventDefault();

    if (typeof this._typeChangeHandler !== `function`) {
      return;
    }

    this._currentSortType = this._getSortType(evt);
    this._typeChangeHandler(this._currentSortType);
  }
}
