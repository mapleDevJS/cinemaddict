import moment from "moment";

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const MenuType = {
  STATS: `stats`
};

export const FilterNames = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favourites`
};

export const StatsFilterType = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const Filter = {
  ALL: (movie) => movie,
  WATCHLIST: (movie) => movie.isInWatchlist,
  HISTORY: (movie) => movie.isInHistory,
  FAVORITES: (movie) => movie.isInFavorites
};

const StatsFilter = {
  ALL: (movie) => movie,
  TODAY: (movie) => moment(movie.watchingDate).isSame(moment(), `day`),
  WEEK: (movie) => moment(movie.watchingDate).isAfter(moment().subtract(7, `days`)),
  MONTH: (movie) => moment(movie.watchingDate).isAfter(moment().subtract(1, `months`)),
  YEAR: (movie) => moment(movie.watchingDate).isAfter(moment().subtract(1, `years`))
};

export const getMoviesByFilter = (movies, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return movies.filter(Filter.ALL);
    case FilterType.WATCHLIST:
      return movies.filter(Filter.WATCHLIST);
    case FilterType.HISTORY:
      return movies.filter(Filter.HISTORY);
    case FilterType.FAVORITES:
      return movies.filter(Filter.FAVORITES);
    case MenuType.STATS:
      return movies.filter(Filter.ALL);
    case StatsFilterType.TODAY:
      return movies.filter(StatsFilter.TODAY);
    case StatsFilterType.WEEK:
      return movies.filter(StatsFilter.WEEK);
    case StatsFilterType.MONTH:
      return movies.filter(StatsFilter.MONTH);
    case StatsFilterType.YEAR:
      return movies.filter(StatsFilter.YEAR);
  }

  return movies;
};
