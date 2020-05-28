import AbstractSmart from "./abstract-smart";

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

const LINK_TAG_NAME = `A`;

export default class Sort extends AbstractSmart {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
    this._sortTypeChangeListener = null;
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

  _createSortItemMarkup(key, value) {
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
      return this._createSortItemMarkup(key, SortType[key]);
    })
    .join(`\n`);
  }

  recoverListeners() {
    this.setTypeChangeListener(this._sortTypeChangeListener);
  }

  resetSortToDefault() {
    this._currentSortType = SortType.DEFAULT;
    this.rerender();
  }

  setTypeChangeListener(listener) {
    this._sortTypeChangeListener = listener;
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== LINK_TAG_NAME) {
        return;
      }

      const sortType = SortType[evt.target.dataset.sortType];

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      listener(this._currentSortType);
      super.rerender();
    });
  }
}
