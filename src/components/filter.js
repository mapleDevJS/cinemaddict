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
        const filtersMarkup = this._filters.map(this._createMarkup).join(`\n`);
        const menuMarkup = this._menuItems.map(this._createMarkup).join(`\n`);
        return (
            `<nav class="main-navigation">
        <div class="main-navigation__items">${filtersMarkup}</div>
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

    _createMarkup({type, name, count, active}) {
        const itemClass = (count !== undefined) ? "main-navigation__item" : "main-navigation__additional";
        const countBlock = (count !== undefined && type !== FilterType.ALL) ? `<span class="main-navigation__item-count">${count}</span>` : ``;
        const isActive = active ? `${itemClass}--active` : ``;
        return (
            `<a href="#${type}" class="${itemClass} ${isActive}">
        ${name}
        ${countBlock}
      </a>`
        );
    }

    _getFilterNameByHash(hash) {
        return hash.substring(1, hash.length);
    }
}
