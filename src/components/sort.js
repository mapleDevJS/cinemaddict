import Abstract from "./abstract";

export const SORT_TYPES = {
  DEFAULT: `by default`,
  DATE: `by date`,
  RATING: `by rating`
};

export default class Sort extends Abstract {
  constructor() {
    super();

    this._currenSortType = SORT_TYPES.DEFAULT;
  }

  _getSortItems() {
    // return SORT_TYPES.map((type) =>
    //   `<li><a href="#" class="sort__button sort__button--active">Sort ${type}</a></li>`
    // ).join(`\n`);

    let markup = ``;
    for (let [key, value] of Object.entries(SORT_TYPES)) {
      markup += `<li><a href="#" data-sort-type="${key}" class="sort__button sort__button--active">Sort ${value}</a></li>`;
    }
    return markup;
  }

  getTemplate() {
    return (
      `<ul class="sort">
        ${this._getSortItems()}
      </ul>`
    );
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      // const sortType = evt.target.dataset.sortType;
      const sortType = evt.target.dataset.sortType;


      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;

      handler(this._currenSortType);
    });
  }
}
