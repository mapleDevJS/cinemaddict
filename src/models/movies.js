import {getMoviesByFilter, FilterType} from "../util/filter";

export default class MoviesModel {
  constructor() {
    this._movies = [];
    this._comments = [];

    this._activeFilterType = FilterType.ALL;

    this._dataChangeListeners = [];
    this._filterChangeListeners = [];
  }

  get movies() {
    return getMoviesByFilter(this._movies, this._activeFilterType);
  }

  set movies(movies) {
    this._movies = Array.from(movies);
    this._callListeners(this._dataChangeListeners);
  }

  getAllMovies() {
    return this._movies;
  }

  updateMovie(id, movie) {
    const index = this._movies.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(0, index), movie, this._movies.slice(index + 1));

    this._callListeners(this._dataChangeListeners);

    return true;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callListeners(this._filterChangeListeners);
  }

  setFilterChangeListener(listener) {
    this._filterChangeListeners.push(listener);
  }

  setDataChangeListener(listener) {
    this._dataChangeListeners.push(listener);
  }

  _callListeners(listeners) {
    listeners.forEach((listener) => listener());
  }
}
