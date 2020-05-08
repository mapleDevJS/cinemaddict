import Abstract from "./abstract";

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export default class Sort extends Abstract {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return (
      `<ul class="sort">
        ${this._getSortMarkup()}
      </ul>`
    );
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChangeListener(listener) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = SortType[evt.target.dataset.sortType];

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      listener(this._currentSortType);
    });
  }

  _getSortItem(key, value) {
    return (
      `<li>
        <a href="#"
          data-sort-type="${key}"
          class="sort__button ${this._currentSortType === value ? `sort__button--active` : ``}"
        >
          Sort by ${value}
        </a>
      </li>`
    );
  }

  _getSortMarkup() {
    return Object.keys(SortType).map((key) => {
      return this._getSortItem(key, SortType[key]);
    })
    .join(`\n`);
  }
}
