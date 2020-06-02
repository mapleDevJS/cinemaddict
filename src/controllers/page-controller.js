import ButtonShowMore from "../components/films/button-showmore";
import FilmsList from "../components/films/films-list";
import FilmsListExtra from "../components/films/films-list-extra";
import MovieController, {Mode} from "./movie-controller";
import NoMovies from "../components/films/no-movies";
import {getDateFromString} from "../util/util";
import {SortType} from "../components/sort";
import {QUANTITY_MOVIES} from "../util/consts";


const SECTIONS = {
  RATING: `Top Rated`,
  COMMENTS: `Most commented`
};

const MOVIES_IN_SECTION = 2;

export default class PageController {
  constructor(filmsComponent, sortComponent, moviesModel, commentsModel, api) {
    this._container = filmsComponent.getElement();
    this._sortComponent = sortComponent;

    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;

    this._api = api;

    this._shownControllers = [];
    this._shownMoviesTotal = QUANTITY_MOVIES.ON_START;
    this._noMoviesComponent = new NoMovies();


    this._filmsListComponent = new FilmsList();
    this._filmsList = this._filmsListComponent.getElement();
    this._filmsListContainer = this._filmsListComponent.filmsListElement;

    this._buttonShowMore = new ButtonShowMore();

    this._filmsListTopRatedComponent = new FilmsListExtra(SECTIONS.RATING);
    this._filmsListMostCommentedComponent = new FilmsListExtra(SECTIONS.COMMENTS);

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._onButtonShowMoreClick = this._onButtonShowMoreClick.bind(this);
    this._sortComponent.setTypeChangeListener(this._onSortTypeChange);
    this._moviesModel.setFilterChangeListener(this._onFilterChange);
  }

  render() {
    const movies = this._moviesModel.movies;

    if (movies.length === 0) {
      this._noMoviesComponent.render(this._container);
      return;
    }

    this._filmsListComponent.render(this._container);

    this._renderMovies(movies);
    this._renderButtonShowMore();

    this._filmsListTopRatedComponent.render(this._container);
    this._filmsListMostCommentedComponent.render(this._container);

    this._renderTopRatedMovies();
    this._renderMostCommentedMovies();
  }

  _renderMovies(movies) {
    const moviesToRender = movies.slice(0, this._shownMoviesTotal);

    const newMoviesController = this._renderMovieCards(this._filmsListContainer, moviesToRender, this._onDataChange, this._onViewChange);

    this._shownControllers = this._shownControllers.concat(newMoviesController);
  }

  _renderMovieCards(container, movies, onDataChange, onViewChange) {
    return movies.map((movie) => {
      const movieController = new MovieController(container, onDataChange, onViewChange, this._commentsModel, this._api);

      const commentsToRender = this._commentsModel.getMovieComments(movie);
      movieController.render(movie, commentsToRender);

      return movieController;
    });
  }

  _renderButtonShowMore() {
    this._buttonShowMore.remove();

    if (this._shownMoviesTotal >= this._moviesModel.movies.length) {
      return;
    }

    this._buttonShowMore.render(this._filmsList);
    this._buttonShowMore.setClickListener(this._onButtonShowMoreClick);
  }

  _getMostCommentedMovies(movies) {
    return movies.slice()
      .sort((firstMovie, secondMovie) => secondMovie.comments.length - firstMovie.comments.length)
      .slice(0, MOVIES_IN_SECTION);
  }

  _getTopRatedMovies(movies) {
    return movies.slice()
      .sort((firstMovie, secondMovie) => secondMovie.rating - firstMovie.rating)
      .slice(0, MOVIES_IN_SECTION);
  }

  _renderTopRatedMovies() {
    if (this._filmsListTopRatedComponent) {
      this._filmsListTopRatedComponent.remove();
    }
    const movies = this._moviesModel.getAllMovies();

    this._filmsListTopRatedComponent = new FilmsListExtra(SECTIONS.RATING);
    this._filmsListTopRatedComponent.render(this._container);

    const topRatedMovies = this._getTopRatedMovies(movies);

    const totalRating = movies.reduce((total, movie) => {
      total += parseFloat(movie.rating, 10);
      return total;
    }, 0);

    if (totalRating === 0) {
      return;
    }

    const container = this._filmsListTopRatedComponent.filmsListContainer;

    const newMoviesController = this._renderMovieCards(container, topRatedMovies, this._onDataChange, this._onViewChange);

    this._shownControllers = this._shownControllers.concat(newMoviesController);
  }

  _renderMostCommentedMovies() {
    if (this._filmsListMostCommentedComponent) {
      this._filmsListMostCommentedComponent.remove();
    }

    this._filmsListMostCommentedComponent = new FilmsListExtra(SECTIONS.COMMENTS);
    this._filmsListMostCommentedComponent.render(this._container);

    const movies = this._moviesModel.getAllMovies();

    const totalComment = movies.reduce((total, movie) => {
      total += movie.comments.length;
      return total;
    }, 0);

    const mostCommentedMovies = this._getMostCommentedMovies(movies);

    if (totalComment === 0) {
      return;
    }

    const container = this._filmsListMostCommentedComponent.filmsListContainer;

    const newMoviesController = this._renderMovieCards(container, mostCommentedMovies, this._onDataChange, this._onViewChange);
    this._shownControllers = this._shownControllers.concat(newMoviesController);
  }

  _getSortedMovies(movies, sortType, from, to) {
    let sortedMovies = [];

    const shownMovies = movies.slice();

    switch (sortType) {
      case SortType.DATE:
        sortedMovies = shownMovies.sort((a, b) => getDateFromString(b.release) - getDateFromString(a.release));
        break;
      case SortType.RATING:
        sortedMovies = shownMovies.sort((a, b) => b.rating - a.rating);
        break;
      case SortType.DEFAULT:
        sortedMovies = shownMovies;
        break;
      case SECTIONS.COMMENTS:
        sortedMovies = shownMovies.sort((a, b) => b.comments.length - a.comments.length);
        break;
    }

    return sortedMovies.slice(from, to);
  }

  _updateMovies(count) {
    this._removeMovies();
    const moviesToRender = this._getSortedMovies(this._moviesModel.movies, this._sortComponent.sortType, 0, count);

    this._renderMovies(moviesToRender);
    this._renderButtonShowMore();
    this._renderTopRatedMovies();
    this._renderMostCommentedMovies();
  }

  _removeMovies() {
    this._shownControllers.forEach((movieController) => movieController.destroy());
    this._shownControllers = [];
  }

  _onDataChange(oldMovie, newMovie, mode) {
    this._api.updateMovie(oldMovie.id, newMovie)
      .then((movie) => {
        const isSuccess = this._moviesModel.updateMovie(oldMovie.id, movie);
        if (isSuccess) {
          const isAllMoviesShown = (this._moviesModel.movies.length === this._moviesModel.getAllMovies().length);

          if (mode === Mode.DETAILS || isAllMoviesShown) {
            this._shownControllers
            .filter((controller) => controller._filmCardComponent._movie.id === oldMovie.id)
            .forEach((movieController) => {
              const commentsToRender = this._commentsModel.getMovieComments(newMovie);
              movieController.render(movie, commentsToRender);
            });
            this._renderMostCommentedMovies();
          } else {
            this._updateMovies(this._shownMoviesTotal);
          }
        }
      });
  }

  _onSortTypeChange(sortType) {
    this._shownMoviesTotal = QUANTITY_MOVIES.ON_START;

    const sortedMovies = this._getSortedMovies(this._moviesModel.movies, sortType, 0, this._shownMoviesTotal);

    this._removeMovies();

    this._renderMovies(sortedMovies);
    this._renderButtonShowMore();

    this._renderTopRatedMovies(sortedMovies);
    this._renderMostCommentedMovies(sortedMovies);
  }

  _onButtonShowMoreClick() {
    const movies = this._moviesModel.movies;

    this._shownMoviesTotal = this._shownMoviesTotal + QUANTITY_MOVIES.BY_BUTTON;

    const sortedMovies = this._getSortedMovies(movies, this._sortComponent.sortType, 0, this._shownMoviesTotal);

    this._removeMovies();
    this._renderMovies(sortedMovies);


    if (this._shownMoviesTotal >= movies.length) {
      this._buttonShowMore.remove();
    }

    this._renderTopRatedMovies();
    this._renderMostCommentedMovies();
  }

  _onFilterChange() {
    this._sortComponent.resetSortType();

    this._shownMoviesTotal = QUANTITY_MOVIES.ON_START;
    this._updateMovies(this._shownMoviesTotal);
  }

  _onViewChange() {
    this._shownControllers.forEach((controller) => {
      controller.setDefaultView();
    });
  }
}
