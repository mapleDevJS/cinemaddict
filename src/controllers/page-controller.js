import NoFilms from "../components/films/no-films";
import FilmsList from "../components/films/films-list";
import FilmsListExtra from "../components/films/films-list-extra";
import ButtonShowMore from "../components/films/button-showmore";
import MovieController from "./movie-controller";
import {render, remove} from "../util/dom-util";
import {SortType} from "../components/sort";
import {sortArrayOfObjectsByKey, getDateFromString} from "../util/util";
import {QUANTITY_FILMS} from "../util/consts";

const SECTIONS = new Map([
  [`rating`, `Top Rated`],
  [`comments`, `Most commented`]
]);

const TOP_FILMS_NUMBER = 2;

export default class PageController {
  constructor(container, sortComponent) {
    this._container = container;
    this._films = [];
    this._shownMovieControllers = [];

    this._sortComponent = sortComponent;

    this._noFilmsComponent = new NoFilms();
    this._buttonShowMore = new ButtonShowMore();

    this._filmsListComponent = new FilmsList();
    this._filmsList = this._filmsListComponent.getElement();
    this._filmsListContainer = this._filmsListComponent.getFilmsListContainer();

    this._shownFilmsCount = QUANTITY_FILMS.ON_START;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(films) {
    this._films = films;
    const container = this._container.getElement();

    if (films.length === 0) {
      render(container, this._noFilmsComponent);
      return;
    }

    render(container, this._filmsListComponent);

    const newFilms = this._renderFilmCards(this._filmsListContainer, this._films.slice(0, this._shownFilmsCount), this._onDataChange, this._onViewChange);
    this._shownMovieControllers = this._shownMovieControllers.concat(newFilms);

    this._renderButtonShowMore();
    this._buttonShowMore.setClickListener(() => {
      this._onButtonShowMoreClick(films);
    });

    this._sortComponent.setSortTypeChangeListener(this._onSortTypeChange);

    this._renderFilmExtraSections(container, films, this._onDataChange, this._onViewChange);
  }

  _renderFilmCards(container, films, onDataChange, onViewChange) {
    return films.map((film) => {
      const movieController = new MovieController(container, onDataChange, onViewChange);
      movieController.render(film);
      return movieController;
    });
  }
  _renderButtonShowMore() {
    if (this._shownFilmsCount >= this._films.length) {
      return;
    }

    render(this._filmsList, this._buttonShowMore);
  }

  _getTopFilms(films, key) {
    return films.slice().sort(sortArrayOfObjectsByKey(key)).slice(0, TOP_FILMS_NUMBER);
  }

  _getSortedFilms(films, sortType, from, to) {
    let sortedFilms = [];
    const shownFilms = films.slice();

    switch (sortType) {
      case SortType.DATE:
        sortedFilms = shownFilms.sort((a, b) => getDateFromString(b.release) - getDateFromString(a.release));
        break;
      case SortType.RATING:
        sortedFilms = shownFilms.sort((a, b) => b.rating - a.rating);
        break;
      case SortType.DEFAULT:
        sortedFilms = shownFilms;
        break;
    }

    return sortedFilms.slice(from, to);
  }

  _renderFilmExtraSections(container, films, onDataChange, onViewChange) {
    SECTIONS.forEach((name, key) => {
      const filmsListExtraComponent = new FilmsListExtra(name);
      render(container, filmsListExtraComponent);

      const topFilms = this._getTopFilms(films, key);
      const filmsListContainer = filmsListExtraComponent.getFilmsListContainer();
      this._renderFilmCards(filmsListContainer, topFilms, onDataChange, onViewChange);
    });
  }

  _onViewChange() {
    this._shownMovieControllers.forEach((it) => {
      it.setDefaultView();
    });
  }

  _onDataChange(oldFilm, newFilm) {
    const index = this._films.findIndex((it) => it === oldFilm);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newFilm, this._films.slice(index + 1));

    this._shownMovieControllers[index].render(this._films[index]);
  }

  _onSortTypeChange(sortType) {
    this._shownFilmsCount = QUANTITY_FILMS.BY_BUTTON;

    const sortedFilms = this._getSortedFilms(this._films, sortType, 0, this._shownFilmsCount);

    this._filmsListContainer.innerHTML = ``;

    this._renderFilmCards(this._filmsListContainer, sortedFilms, this._onViewChange, this._onDataChange);

    this._renderButtonShowMore();
  }

  _onButtonShowMoreClick(films) {
    const prevFilmsCount = this._shownFilmsCount;
    this._shownFilmsCount = this._shownFilmsCount + QUANTITY_FILMS.BY_BUTTON;

    const sortedFilms = this._getSortedFilms(this._films, this._sortComponent.getSortType(), prevFilmsCount, this._shownFilmsCount);
    const newFilms = this._renderFilmCards(this._filmsListContainer, sortedFilms, this._onDataChange, this._onViewChange);

    this._shownMovieControllers = this._shownMovieControllers.concat(newFilms);

    if (this._shownFilmsCount >= films.length) {
      remove(this._buttonShowMore);
    }
  }
}
