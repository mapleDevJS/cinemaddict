import FilmDetails from "../components/films/film-details";
import FilmCard from "../components/films/film-card";
import Movie from "../models/movie";
import {remove, replace} from "../util/dom-util";

const SHAKE_ANIMATION_TIMEOUT = 600;
const MILLISECONDS_COUNT = 1000;

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

      this._onDataChange(movie, newMovie);
    });

    this._filmCardComponent.setAlreadyWatchedClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInHistory = !movie.isInHistory;

      if (newMovie.watchingDate) {
        newMovie.watchingDate = null;
      } else {
        newMovie.watchingDate = new Date();
      }

      this._onDataChange(movie, newMovie);
    });

    this._filmCardComponent.setAddToFavouriteClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInFavorites = !movie.isInFavorites;

      this._onDataChange(movie, newMovie);

    });

    this._filmDetailsComponent.setCloseButtonClickListener(() => this._closeFilmDetails());

    this._filmDetailsComponent.setAddToWatchlistClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInWatchlist = !movie.isInWatchlist;

      this._onDataChange(movie, newMovie);
    });

    this._filmDetailsComponent.setAlreadyWatchedClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInHistory = !movie.isInHistory;

      this._onDataChange(movie, newMovie);
    });

    this._filmDetailsComponent.setAddToFavouriteClickListener(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInFavorites = !movie.isInFavorites;

      this._onDataChange(movie, newMovie);
    });

    this._filmDetailsComponent.setAddNewCommentListener((evt) => {
      this._filmDetailsComponent.commentInput().style.border = `none`;
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

              this._onDataChange(movie, newMovie);
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

          this._onDataChange(movie, newMovie);
        })
        .catch(() => {
          this._shakeComment(commentElement);
        });

    });

    this._filmDetailsComponent.setEmojiClickListener((evt) => {
      const currentEmoji = evt.target.value;
      const emojiContainer = this._filmDetailsComponent.emojiContainer;
      emojiContainer.innerHTML = `<img src="images/emoji/${currentEmoji}.png" width="55" height="55" alt="emoji-${currentEmoji}">`;
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
    this._filmDetailsComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_COUNT}s`;
    this._filmCardComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_COUNT}s`;

    setTimeout(() => {
      this._filmDetailsComponent.getElement().style.animation = ``;
      this._filmCardComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _openFilmDetails() {
    this._onViewChange();
    document.body.appendChild(this._filmDetailsComponent.getElement());
    this._mode = Mode.DETAILS;
    this._filmDetailsComponent.recoverListeners();
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _closeFilmDetails() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    remove(this._filmDetailsComponent);
    this._mode = Mode.DEFAULT;
  }

  _shakeComment(currentComment) {
    currentComment.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_COUNT}s`;

    setTimeout(() => {
      currentComment.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _addCommentFieldBorder() {
    this._filmDetailsComponent.commentInput().style.border = `2px solid red`;
    this._filmDetailsComponent.commentInput().removeAttribute(`disabled`);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closeFilmDetails();
    }
  }
}
