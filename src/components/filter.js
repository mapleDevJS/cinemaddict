import Abstract from "./abstract";

export default class Filter extends Abstract {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  static getFilterNameByHash(hash) {
    return hash.substring(1, hash.length);
  }

  getTemplate() {
    const filtersMarkup = this._filters.map((filter) => this._createFilterMarkup(filter)).join(`\n`);

    return (
      `<nav class="main-navigation">
        <div class="main-navigation__items">
          ${filtersMarkup}
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
      </nav>`
    );
  }

  setFilterChangeListener(listener) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const filterName = Filter.getFilterNameByHash(evt.target.hash);

      listener(filterName);
    });
  }

  _createFilterMarkup({type, name, count, active}) {
    return (
      `<a href="#${type}"
        class="main-navigation__item ${active ? `main-navigation__item--active` : ``}">
          ${name}
        <span class="main-navigation__item-count">
          ${count}
        </span>
      </a>`
    );
  }
}
