import AbstractComponent from "./abstract-component";
import {FilterType} from "../util/filter";

const LINK_TAG_NAME = `A`;

export default class Filter extends AbstractComponent {
  constructor(filters, menuItems) {
    super();

    this._filters = filters;
    this._menuItems = menuItems;
  }

  getTemplate() {
    const filtersMarkup = this._filters.map((filter) => this._createFilterMarkup(filter)).join(`\n`);
    const menuMarkup = this._menuItems.map((filter) => this._createMenuMarkup(filter)).join(`\n`);

    return (
      `<nav class="main-navigation">
        <div class="main-navigation__items">
          ${filtersMarkup}
        </div>
        ${menuMarkup}
      </nav>`
    );
  }

  setFilterChangeListener(listener) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== LINK_TAG_NAME) {
        return;
      }

      const filterName = this._getFilterNameByHash(evt.target.hash);

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

  _createMenuMarkup({type, name, active}) {
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

  _getFilterNameByHash(hash) {
    return hash.substring(1, hash.length);
  }
}
