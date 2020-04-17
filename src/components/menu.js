const FILTER_NAMES = [
  `all`,
  `watchlist`,
  `history`,
  `favourites`
];

const generateFilters = (films) => {
  const filtersByName = {
    all: films,
    watchlist: films.filter((film) => film.isInWatchlist),
    history: films.filter((film) => film.isInHistory),
    favourites: films.filter((film) => film.isInFavorites),
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
};

const createFilterMarkup = ({type, name, count}) => {
  return `<a href="#${type}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`;
};

export const createSiteMenu = (films) => {
  const filters = generateFilters(films);
  const filtersMarkup = filters.map(createFilterMarkup).join(`\n`);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
