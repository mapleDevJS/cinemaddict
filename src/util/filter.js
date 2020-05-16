import {FilterType} from "./consts";

const Filter = {
  ALL: (film) => !film.isInHistory,
  WATCHLIST: (film) => film.isInWatchlist,
  HISTORY: (film) => film.isInHistory,
  FAVORITES: (film) => film.isInFavorites
};

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films.filter(Filter.ALL);
    case FilterType.WATCHLIST:
      return films.filter(Filter.WATCHLIST);
    case FilterType.HISTORY:
      return films.filter(Filter.HISTORY);
    case FilterType.FAVORITES:
      return films.filter(Filter.FAVORITES);
  }

  return films;
};
