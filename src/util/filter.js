// import {FilterType, StatsFilterType} from "./consts";
import moment from "moment";

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const ExtraFilterType = {
  STATS: `stats`
};

export const STATS = `stats`;

export const FilterNames = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favourites`
};

export const ExtraFilterNames = {
  STATS: `Stats`
};

export const StatsFilterNames = {
  ALL: `All time`,
  TODAY: `Today`,
  WEEK: `Week`,
  MONTH: `Month`,
  YEAR: `Year`
};

export const StatsFilterType = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const Filter = {
  ALL: (film) => film,
  WATCHLIST: (film) => film.isInWatchlist,
  HISTORY: (film) => film.isInHistory,
  FAVORITES: (film) => film.isInFavorites,
  STATS: (film) => film
};

const StatsFilter = {
  ALL: (film) => film,
  TODAY: (film) => moment(film.watchingDate).isSame(moment(), `day`),
  WEEK: (film) => moment(film.watchingDate).isAfter(moment().subtract(7, `days`)),
  MONTH: (film) => moment(film.watchingDate).isAfter(moment().subtract(1, `months`)),
  YEAR: (film) => moment(film.watchingDate).isAfter(moment().subtract(1, `years`))
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
    case STATS:
      return films.filter(Filter.ALL);
    case StatsFilterType.TODAY:
      return films.filter(StatsFilter.TODAY);
    case StatsFilterType.WEEK:
      return films.filter(StatsFilter.WEEK);
    case StatsFilterType.MONTH:
      return films.filter(StatsFilter.MONTH);
    case StatsFilterType.YEAR:
      return films.filter(StatsFilter.YEAR);
  }

  return films;
};
