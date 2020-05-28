import ButtonShowMore from "../components/films/button-showmore";
import FilmsList from "../components/films/films-list";
import FilmsListExtra from "../components/films/films-list-extra";
import MovieController from "./movie-controller";
import NoMovies from "../components/films/no-movies";
import {getDateFromString} from "../util/util";
import {remove} from "../util/dom-util";
import {SortType} from "../components/sort";
import {TOT_MOVIES} from "../util/consts";


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

    this._shownMovieControllers = [];
    this._shownMoviesTot = TOT_MOVIES.ON_START;
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
    this._sortComponent.setSortTypeChangeListener(this._onSortTypeChange);
    this._moviesModel.setFilterChangeListener(this._onFilterChange);
  }

  render() {
    const container = this._container;

    const movies = this._moviesModel.filteredMovies;

    if (movies.length === 0) {
      this._noMoviesComponent.render(container);
      return;
    }

    this._filmsListComponent.render(container);

    this._renderMovies(movies);
    this._renderButtonShowMore();

    this._filmsListTopRatedComponent.render(container);
    this._filmsListMostCommentedComponent.render(container);

    this._renderTopRatedMovies();
    this._renderMostCommentedMovies();
  }

  _renderTopRatedMovies() {
    const movies = this._moviesModel.movies;

    const topRatedMovies = this._getSortedMovies(movies, SortType.RATING, 0, MOVIES_IN_SECTION);

    const totalRatings = movies.reduce((total, movie) => {
      total += parseFloat(movie.rating, 10);
      return total;
    }, 0);

    if (totalRatings === 0) {
      return;
    }

    const container = this._filmsListTopRatedComponent.filmsListContainer;

    const newMovies = this._renderMovieCards(container, topRatedMovies, this._onDataChange, this._onViewChange);

    this._shownMovieControllers = this._shownMovieControllers.concat(newMovies);
  }

  _renderMostCommentedMovies() {
    const movies = this._moviesModel.movies;

    const totalComments = movies.reduce((total, movie) => {
      total += movie.comments.length;
      return total;
    }, 0);

    const mostCommentedMovies = this._getSortedMovies(movies, SECTIONS.COMMENTS, 0, MOVIES_IN_SECTION);

    if (totalComments === 0) {
      return;
    }

    const container = this._filmsListMostCommentedComponent.filmsListContainer;

    const newMovies = this._renderMovieCards(container, mostCommentedMovies, this._onDataChange, this._onViewChange);
    this._shownMovieControllers = this._shownMovieControllers.concat(newMovies);
  }

  _renderMovies(movies) {
    const moviesToRender = movies.slice(0, this._shownMoviesTot);
    const newMovies = this._renderMovieCards(this._filmsListContainer, moviesToRender, this._onDataChange, this._onViewChange);

    this._shownMovieControllers = this._shownMovieControllers.concat(newMovies);

    if (this._shownMovieControllers.length > TOT_MOVIES.ON_START) {
      this._shownMoviesTot = this._shownMovieControllers.length;
    } else {
      this._shownMoviesTot = TOT_MOVIES.ON_START;
    }
  }

  _renderMovieCards(container, movies, onDataChange, onViewChange) {
    return movies.map((movie) => {
      const movieController = new MovieController(container, onDataChange, onViewChange, this._commentsModel, this._api);

      const commentsToRender = this._commentsModel.getCommentsByMovie(movie);
      movieController.render(movie, commentsToRender);

      return movieController;
    });
  }

  _renderButtonShowMore() {
    remove(this._buttonShowMore);

    if (this._shownMoviesTot >= this._moviesModel.filteredMovies.length) {
      return;
    }

    this._buttonShowMore.render(this._filmsList);
    this._buttonShowMore.setClickListener(this._onButtonShowMoreClick);
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

    const moviesToRender = this._moviesModel.filteredMovies.slice(0, count);
    this._renderMovies(moviesToRender);

    this._renderButtonShowMore();
  }

  _removeMovies() {
    this._shownMovieControllers.forEach((movieController) => movieController.destroy());
    this._shownMovieControllers = [];
  }

  _onDataChange(oldMovie, newMovie) {
    this._api.updateMovie(oldMovie.id, newMovie)
      .then((movie) => {
        const isSuccess = this._moviesModel.updateMovie(oldMovie.id, movie);
        if (isSuccess) {
          this._shownMovieControllers
            .filter((controller) => controller._filmCardComponent._movie.id === oldMovie.id)
            .forEach((movieController) => {
              const commentsToRender = this._commentsModel.getCommentsByMovie(newMovie);
              movieController.render(movie, commentsToRender);
            });
        }

        if (oldMovie.comments.length !== newMovie.comments.length) {
          this._filmsListMostCommentedComponent.remove();
          this._filmsListMostCommentedComponent = new FilmsListExtra(SECTIONS.COMMENTS);
          this._filmsListMostCommentedComponent.render(this._container);
          this._renderMostCommentedMovies();
        }
      });
  }

  _onViewChange() {
    this._shownMovieControllers.forEach((it) => {
      it.setDefaultView();
    });
  }

  _onSortTypeChange(sortType) {
    this._shownMoviesTot = TOT_MOVIES.BY_BUTTON;

    const sortedMovies = this._getSortedMovies(this._moviesModel.movies, sortType, 0, this._shownMoviesTot);

    this._removeMovies();

    this._renderMovies(sortedMovies);
    this._renderButtonShowMore();

    this._renderTopRatedMovies();
    this._renderMostCommentedMovies();
  }

  _onFilterChange() {
    this._updateMovies(TOT_MOVIES.ON_START);
    this._renderTopRatedMovies();
    this._renderMostCommentedMovies();
  }

  _onButtonShowMoreClick() {
    const movies = this._moviesModel.filteredMovies;

    const prevMoviesCount = this._shownMoviesTot;
    this._shownMoviesTot = this._shownMoviesTot + TOT_MOVIES.BY_BUTTON;

    const sortedMovies = this._getSortedMovies(movies, this._sortComponent.getSortType(), prevMoviesCount, this._shownMoviesTot);
    this._renderMovies(sortedMovies);

    if (this._shownMoviesTot >= movies.length) {
      remove(this._buttonShowMore);
    }
  }
}
