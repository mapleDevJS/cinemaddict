import Abstract from "./abstract";
import {FilterType} from "../util/filter";

export default class Filter extends Abstract {
  constructor(filters, extraFilters) {
    super();

    this._filters = filters;
    this._extraFilters = extraFilters;
  }

  static getFilterNameByHash(hash) {
    return hash.substring(1, hash.length);
  }

  getTemplate() {
    const filtersMarkup = this._filters.map((filter) => this._createFilterMarkup(filter)).join(`\n`);
    const extraFilterMarkup = this._extraFilters.map((filter) => this._createExtraFilterMarkup(filter)).join(`\n`);

    return (
      `<nav class="main-navigation">
        <div class="main-navigation__items">
          ${filtersMarkup}
        </div>
        ${extraFilterMarkup}
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


      // if (filterName === ExtraFilterType.STATS) {
      //   extralistener(filterName);
      //   return;
      // }

      listener(filterName);
    });
  }

  _createFilterMarkup({type, name, count, active}) {
    return (
      `<a href="#${type}"
        class="main-navigation__item ${active ? `main-navigation__item--active` : ``}">
          ${name}
        ${this._showCount(type, count)}
      </a>`
    );
  }

  _createExtraFilterMarkup({type, name, active}) {
    return (
      `<a href="#${type}" class="main-navigation__additional ${active ? `main-navigation__additional--active` : ``}">
        ${name}
      </a>`
    );
  }

  _showCount(type, count) {
    if (type !== FilterType.ALL) {
      return (
        `<span class="main-navigation__item-count">
          ${count}
        </span>`
      );
    }
    return ``;
  }
}
