import Abstract from "./abstract";

const FILTER_NAMES = [
  `all`,
  `watchlist`,
  `history`,
  `favourites`
];

export default class Filter extends Abstract {
  constructor(films) {
    super();
    this._films = films;
  }

  _generateFilters() {
    const filtersByName = {
      all: this._films,
      watchlist: this._films.filter((film) => film.isInWatchlist),
      history: this._films.filter((film) => film.isInHistory),
      favourites: this._films.filter((film) => film.isInFavorites),
    };

    const filtersCount = FILTER_NAMES.reduce((list, name) => {
      list[name] = filtersByName[name].length;
      return list;
    }, {});

    return FILTER_NAMES.map((type) => {
      const name = type.charAt(0).toUpperCase() + type.slice(1);
      const count = filtersCount[type] || 0;

      return {
        type,
        name,
        count
      };
    });
  }

  _getFilters({type, name, count}) {
    return `<a href="#${type}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`;
  }

  getTemplate() {
    const filters = this._generateFilters();
    const filtersMarkup = filters.map((filter) => this._getFilters(filter)).join(`\n`);
    return (
      `<nav class="main-navigation">
        <div class="main-navigation__items">
          ${filtersMarkup}
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
      </nav>`
    );
  }
}
