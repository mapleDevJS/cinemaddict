import FilmDetails from "../components/films/film-details";
import FilmCard from "../components/films/film-card";
import Movie from "../models/movie";
import {replace} from "../util/dom-util";
import {isEscKey} from "../util/util";

export const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

const isCmdEnterKeysCode = (evt) => {
  return evt.code === `Enter` && (evt.ctrlKey || evt.metaKey);
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, commentsModel, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._commentsModel = commentsModel;

    this._api = api;

    this._mode = Mode.DEFAULT;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(movie, comments) {
    this._movie = movie;
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCard(movie);
    this._filmDetailsComponent = new FilmDetails(movie, comments);

    this._setFilmCardsListeners(movie);
    this._setFilmDetailsListeners(movie);

    if (oldFilmDetailsComponent && oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      this._filmCardComponent.render(this._container);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeFilmDetails();
    }
  }

  destroy() {
    this._filmDetailsComponent.remove();
    this._filmCardComponent.remove();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _setFilmCardsListeners(movie) {
    this._filmCardComponent.setPosterClickListener(() => {
      this._onFilmCardElementClick();
    });

    this._filmCardComponent.setTitleClickListener(() => {
      this._onFilmCardElementClick();
    });

    this._filmCardComponent.setCommentsClickListener(() => {
      this._onFilmCardElementClick();
    });

    this._filmCardComponent.setAddToWatchlistClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInWatchlist = !movie.isInWatchlist;

      this._onDataChange(movie, newMovie, this._mode);
    });

    this._filmCardComponent.setAlreadyWatchedClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInHistory = !movie.isInHistory;

      newMovie.watchingDate = newMovie.isInHistory ? new Date() : null;

      this._onDataChange(movie, newMovie, this._mode);
    });

    this._filmCardComponent.setAddToFavouriteClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInFavorites = !movie.isInFavorites;

      this._onDataChange(movie, newMovie, this._mode);
    });
  }

  _setFilmDetailsListeners(movie) {
    this._filmDetailsComponent.setCloseButtonClickListener(() => this._closeFilmDetails());

    this._filmDetailsComponent.setAddToWatchlistClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInWatchlist = !movie.isInWatchlist;

      this._onDataChange(movie, newMovie, this._mode);
    });

    this._filmDetailsComponent.setAlreadyWatchedClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInHistory = !movie.isInHistory;

      newMovie.watchingDate = newMovie.isInHistory ? new Date() : null;

      this._onDataChange(movie, newMovie, this._mode);
    });

    this._filmDetailsComponent.setAddToFavouriteClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInFavorites = !movie.isInFavorites;

      this._onDataChange(movie, newMovie, this._mode);
    });

    this._filmDetailsComponent.setAddNewCommentListener((evt) => {
      this._filmDetailsComponent.setCommentFormValid(false);

      if (isCmdEnterKeysCode(evt)) {

        const newComment = this._filmDetailsComponent.getNewComment();

        if (newComment) {
          this._filmDetailsComponent.setFormLocked(true);
          this._api.createComment(movie.id, newComment)
            .then(({newMovie, newComments}) => {
              const commentsInModel = new Set(this._commentsModel.comments.map((comment) => comment.id));

              newComments.filter((comment) => !commentsInModel.has(comment.id))
                .forEach((comment) => this._commentsModel.addComment(comment));

              this._onDataChange(movie, newMovie, this._mode);
            })
            .catch(() => {
              this._filmDetailsComponent.shake();
              this._addCommentFieldBorder();
            });
        } else {
          this._filmDetailsComponent.shake();
        }
      }
    });

    this._filmDetailsComponent.setDeleteCommentClickListener((evt) => {
      const newMovie = Movie.clone(movie);
      const removingCommentId = this._filmDetailsComponent.getCommentId(evt);

      this._api.deleteComment(removingCommentId)
        .then(() => {
          newMovie.comments = movie.comments.filter((id) => {
            return id !== removingCommentId;
          });
          this._onDataChange(movie, newMovie, this._mode);
        })
        .catch(() => {
          this._filmDetailsComponent.shake();
        });

    });
  }

  _openFilmDetails() {
    document.body.appendChild(this._filmDetailsComponent.getElement());
    this._mode = Mode.DETAILS;
    this._filmDetailsComponent.recoverListeners();
  }

  _closeFilmDetails() {
    this._filmDetailsComponent.remove();
    this. _mode = Mode.DEFAULT;

    const newMovie = Movie.clone(this._movie);
    this._onDataChange(this._movie, newMovie, this._mode);
  }

  _getWatchingDate(flag) {
    return flag ? new Date() : null;
  }

  _addCommentFieldBorder() {
    this._filmDetailsComponent.setCommentFormValid(true);
    this._filmDetailsComponent.setFormLocked(false);
  }

  _onFilmCardElementClick() {
    this._openFilmDetails();
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (isEscKey(evt)) {
      this._closeFilmDetails();
    }
  }
}
