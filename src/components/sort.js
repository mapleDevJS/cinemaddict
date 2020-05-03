import Abstract from "./abstract";

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export default class Sort extends Abstract {
  constructor() {
    super();

    // this._typeChangeHandler = null;
    this._currentSortType = SortType.DEFAULT;
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

  getTemplate() {
    return (
      `<ul class="sort">
        ${this._getSortMarkup()}
      </ul>`
    );
  }

  // getElement() {
  //   const element = super.getElement();
  //   element.addEventListener(`click`, this._handleClick);
  //   return element;
  // }

  // _handleClick(evt) {
  //   evt.preventDefault();

  //   this._currentSortType = SortType[evt.target.dataset.sortType];

  //   if (typeof this._typeChangeHandler === `function`) {
  //     this._typeChangeHandler(this._currentSortType);
  //   }
  // }

  // setTypeChangeHandler(handler) {
  //   handler(this._currenSortType);
  // }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChangeHandler(handler) {
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

      handler(this._currentSortType);
    });
  }
}
