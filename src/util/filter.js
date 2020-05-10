import {FilterType} from "./consts";

export const getNotWatchedFilms = (films) => {
  return films.filter((film) => !film.isInHistory);
};

export const getWatchlistFilms = (films) => {
  return films.filter((film) => film.isInWatchlist);
};

export const getHistoryFilms = (films) => {
  return films.filter((film) => film.isInHistory);
};

export const getFavoriteFilms = (films) => {
  return films.filter((film) => film.isInFavorites);
};

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return getNotWatchedFilms(films);
    case FilterType.WATCHLIST:
      return getWatchlistFilms(films);
    case FilterType.HISTORY:
      return getHistoryFilms(getNotWatchedFilms(films));
    case FilterType.FAVORITES:
      return getFavoriteFilms(getNotWatchedFilms(films));
  }
  return films;
};
