import {getFilmsByFilter, FilterType} from "../util/filter";

export default class MoviesModel {
  constructor() {
    this._films = [];
    this._comments = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeListeners = [];
    this._filterChangeListeners = [];
  }

  get filteredFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  get films() {
    return this._films;
  }

  set films(films = []) {
    this._films = Array.from(films);
    this._callListeners(this._dataChangeListeners);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callListeners(this._filterChangeListeners);
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    this._callListeners(this._dataChangeListeners);

    return true;
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
