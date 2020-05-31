import FilmDetails from "../components/films/film-details";
import FilmCard from "../components/films/film-card";
import Movie from "../models/movie";
import {remove, replace} from "../util/dom-util";
import {SHAKE_ANIMATION_TIMEOUT, MILLISECONDS_COUNT} from "../util/consts";

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
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCard(movie);
    this._filmDetailsComponent = new FilmDetails(movie, comments);

    this._filmCardComponent.setPosterClickListener(() => {
      this._openFilmDetails();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmCardComponent.setTitleClickListener(() => {
      this._openFilmDetails();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmCardComponent.setCommentsClickListener(() => {
      this._openFilmDetails();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmCardComponent.setAddToWatchlistClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInWatchlist = !movie.isInWatchlist;

      this._onDataChange(movie, newMovie, this._mode);
    });

    this._filmCardComponent.setAlreadyWatchedClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInHistory = !movie.isInHistory;

      if (newMovie.watchingDate) {
        newMovie.watchingDate = null;
      } else {
        newMovie.watchingDate = new Date();
      }

      this._onDataChange(movie, newMovie, this._mode);
    });

    this._filmCardComponent.setAddToFavouriteClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInFavorites = !movie.isInFavorites;

      this._onDataChange(movie, newMovie, this._mode);
    });

    this._filmDetailsComponent.setCloseButtonClickListener(() => this._closeFilmDetails());

    this._filmDetailsComponent.setAddToWatchlistClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInWatchlist = !movie.isInWatchlist;

      this._onDataChange(movie, newMovie, this._mode);
    });

    this._filmDetailsComponent.setAlreadyWatchedClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInHistory = !movie.isInHistory;

      this._onDataChange(movie, newMovie, this._mode);
    });

    this._filmDetailsComponent.setAddToFavouriteClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInFavorites = !movie.isInFavorites;

      this._onDataChange(movie, newMovie, this._mode);
    });

    this._filmDetailsComponent.setAddNewCommentListener((evt) => {
      evt.target.style.border = `none`;

      if (isCmdEnterKeysCode(evt)) {
        const newComment = this._filmDetailsComponent.getNewComment();

        if (newComment) {
          this._api.createComment(movie.id, newComment)
            .then(({newMovie, newComments}) => {
              const commentsInModel = new Set(this._commentsModel.comments.map((comment) => comment.id));

              newComments.filter((comment) => !commentsInModel.has(comment.id))
                .forEach((comment) => this._commentsModel.addComment(comment));

              const formELements = this._filmDetailsComponent.formElements;
              formELements.forEach((element) => {
                element.setAttribute(`disabled`, `disabled`);
              });

              this._onDataChange(movie, newMovie, this._mode);
            })
            .catch(() => {
              this.shake();
              this._addCommentFieldBorder();
            });
        }
      }
    });

    this._filmDetailsComponent.setDeleteCommentClickListener((evt) => {
      evt.preventDefault();

      const deleteButton = evt.target;
      const newMovie = Movie.clone(movie);

      const commentElement = evt.target.closest(`.film-details__comment`);
      const removeCommentId = commentElement.dataset.commentId;

      this._api.deleteComment(removeCommentId)
        .then(() => {
          newMovie.comments = movie.comments.filter((id) => {
            return id !== removeCommentId;
          });

          deleteButton.innerHTML = `Deleting...`;
          deleteButton.setAttribute(`disabled`, `true`);

          this._onDataChange(movie, newMovie, this._mode);
        })
        .catch(() => {
          this._shakeComment(commentElement);
        });

    });

    this._filmDetailsComponent.setEmojiClickListener((evt) => {
      this._filmDetailsComponent.setEmoji(evt.target.value);
    });

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
    remove(this._filmDetailsComponent);
    remove(this._filmCardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._filmDetailsComponent.shake();

    setTimeout(() => {
      this._filmDetailsComponent.resetShaking();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _openFilmDetails() {
    document.body.appendChild(this._filmDetailsComponent.getElement());
    this._mode = Mode.DETAILS;
    this._filmDetailsComponent.recoverListeners();
  }

  _closeFilmDetails() {
    remove(this._filmDetailsComponent);
    // this._filmDetailsComponent.setEmoji(null);
    this. _mode = Mode.DEFAULT;
  }

  _shakeComment(currentComment) {
    currentComment.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_COUNT}s`;

    setTimeout(() => {
      currentComment.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _addCommentFieldBorder() {
    this._filmDetailsComponent.commentInput.style.border = `2px solid red`;
    this._filmDetailsComponent.commentInput.removeAttribute(`disabled`);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closeFilmDetails();
    }
  }
}
