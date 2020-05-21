import NoFilms from "../components/films/no-films";
import FilmsList from "../components/films/films-list";
import FilmsListExtra from "../components/films/films-list-extra";
import ButtonShowMore from "../components/films/button-showmore";
import MovieController from "./movie-controller";
import {render, remove} from "../util/dom-util";
import {SortType} from "../components/sort";
import {getDateFromString} from "../util/util";
import {QUANTITY_FILMS} from "../util/consts";

const SECTIONS = {
  RATING: `Top Rated`,
  COMMENTS: `Most commented`
};

const TOP_FILMS_NUMBER = 2;

const getSortedFilms = (films, sortType, from, to) => {
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
    case SECTIONS.COMMENTS:
      sortedFilms = shownFilms.sort((a, b) => b.comments.length - a.comments.length);
      break;
  }

  return sortedFilms.slice(from, to);
};

export default class PageController {
  constructor(container, sortComponent, moviesModel, commentsModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;

    this._shownMovieControllers = [];
    this._shownFilmsCount = QUANTITY_FILMS.ON_START;
    this._noFilmsComponent = new NoFilms();
    this._sortComponent = sortComponent;
    // this._filmsListExtraComponent = null;
    this._filmsListComponent = new FilmsList();
    this._filmsList = this._filmsListComponent.getElement();
    this._filmsListContainer = this._filmsListComponent.getFilmsListContainer();
    this._buttonShowMore = new ButtonShowMore();

    this._mostCommentedFilmsContainer = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._onButtonShowMoreClick = this._onButtonShowMoreClick.bind(this);
    this._sortComponent.setSortTypeChangeListener(this._onSortTypeChange);
    this._moviesModel.setFilterChangeListener(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();

    const films = this._moviesModel.films;

    if (films.length === 0) {
      render(container, this._noFilmsComponent);
      return;
    }

    render(container, this._filmsListComponent);

    this._renderFilms(films.slice(0, this._shownFilmsCount));

    this._renderButtonShowMore();

    this._renderTopRatedFilms(container, films, this._onDataChange, this._onViewChange);
    this._renderMostCommentedFilms(container, films, this._onDataChange, this._onViewChange);
  }

  _removeFilms() {
    this._shownMovieControllers.forEach((movieController) => movieController.destroy());
    this._shownMovieControllers = [];
  }

  _renderFilms(films) {
    const newFilms = this._renderFilmCards(this._filmsListContainer, films.slice(0, this._shownFilmsCount), this._onDataChange, this._onViewChange);
    this._shownMovieControllers = this._shownMovieControllers.concat(newFilms);

    this._shownFilmsCount = this._shownMovieControllers.length;
  }

  _renderFilmCards(container, films, onDataChange, onViewChange) {
    return films.map((film) => {
      const movieController = new MovieController(container, onDataChange, onViewChange, this._commentsModel);
      movieController.render(film, this._commentsModel.getCommentsByFilm(film));
      return movieController;
    });
  }

  _renderButtonShowMore() {
    remove(this._buttonShowMore);

    if (this._shownFilmsCount >= this._moviesModel.filteredFilms.length) {
      return;
    }

    render(this._filmsList, this._buttonShowMore);

    this._buttonShowMore.setClickListener(this._onButtonShowMoreClick);
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._moviesModel.filteredFilms.slice(0, count));
    this._renderButtonShowMore();
  }

  _onDataChange(movieController, oldFilm, newFilm) {
    const isSuccess = this._moviesModel.updateFilm(oldFilm.id, newFilm);

    if (isSuccess) {
      movieController.render(newFilm, this._commentsModel.getCommentsByFilm(newFilm));
    }

    if (oldFilm.comments.length !== newFilm.comments.length) {
      const container = this._container.getElement();
      const films = this._moviesModel.films;

      this._mostCommentedFilmsContainer.remove();

      this._renderMostCommentedFilms(container, films, this._onDataChange, this._onViewChange);
    }
  }

  _onViewChange() {
    this._shownMovieControllers.forEach((it) => {
      it.setDefaultView();
    });
  }

  _onSortTypeChange(sortType) {
    this._shownFilmsCount = QUANTITY_FILMS.BY_BUTTON;

    const sortedFilms = getSortedFilms(this._moviesModel.filteredFilms, sortType, 0, this._shownFilmsCount);

    this._removeFilms();
    this._renderFilms(sortedFilms);

    this._renderButtonShowMore();
  }

  _onFilterChange() {
    this._updateFilms(QUANTITY_FILMS.ON_START);
  }

  _onButtonShowMoreClick() {
    const films = this._moviesModel.filteredFilms;

    const prevFilmsCount = this._shownFilmsCount;
    this._shownFilmsCount = this._shownFilmsCount + QUANTITY_FILMS.BY_BUTTON;

    const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), prevFilmsCount, this._shownFilmsCount);
    this._renderFilms(sortedFilms);

    if (this._shownFilmsCount >= films.length) {
      remove(this._buttonShowMore);
    }
  }

  _renderTopRatedFilms(container, films, onDataChange, onViewChange) {
    const topRatedFilms = getSortedFilms(films, SortType.RATING, 0, TOP_FILMS_NUMBER);

    const filmsListExtraComponent = new FilmsListExtra(SECTIONS.RATING);
    render(container, filmsListExtraComponent);

    const totalRatings = films.reduce((total, film) => {
      total += parseFloat(film.rating, 10);
      return total;
    }, 0);

    if (totalRatings === 0) {
      return;
    }

    const filmsListContainer = filmsListExtraComponent.getFilmsListContainer();
    this._renderFilmCards(filmsListContainer, topRatedFilms, onDataChange, onViewChange);
  }

  _renderMostCommentedFilms(container, films, onDataChange, onViewChange) {
    const totalComments = films.reduce((total, film) => {
      total += film.comments.length;
      return total;
    }, 0);

    const mostCommentedFilms = getSortedFilms(films, SECTIONS.COMMENTS, 0, TOP_FILMS_NUMBER);

    const filmsListExtraComponent = new FilmsListExtra(SECTIONS.COMMENTS);
    this._mostCommentedFilmsContainer = filmsListExtraComponent.getElement();

    render(container, filmsListExtraComponent);

    if (totalComments === 0) {
      return;
    }

    const filmsListContainer = filmsListExtraComponent.getFilmsListContainer();
    this._renderFilmCards(filmsListContainer, mostCommentedFilms, onDataChange, onViewChange);
  }
}
