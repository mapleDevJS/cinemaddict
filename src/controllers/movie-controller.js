import FilmDetails from "../components/films/film-details";
import FilmCard from "../components/films/film-card";
import Movie from "../models/movie";
import {render, remove, replace} from "../util/dom-util";

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

    // this._body = document.querySelector(`body`);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film, comments) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCard(film);
    this._filmDetailsComponent = new FilmDetails(film, comments);

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
      const newFilm = Movie.clone(film);
      newFilm.isInWatchlist = !film.isInWatchlist;

      this._onDataChange(this, film, newFilm);
    });

    this._filmCardComponent.setAlreadyWatchedClickListener(() => {
      const newFilm = Movie.clone(film);
      newFilm.isInHistory = !film.isInHistory;
      newFilm.watchingDate = new Date();

      this._onDataChange(this, film, newFilm);
    });

    this._filmCardComponent.setAddToFavouriteClickListener(() => {
      const newFilm = Movie.clone(film);
      newFilm.isInFavorites = !film.isInFavorites;

      this._onDataChange(this, film, newFilm);

    });

    this._filmDetailsComponent.setCloseButtonClickListener(() => this._closeFilmDetails());

    this._filmDetailsComponent.setAddToWatchlistClickListener(() => {
      const newFilm = Movie.clone(film);
      newFilm.isInWatchlist = !film.isInWatchlist;

      this._onDataChange(this, film, newFilm);
    });

    this._filmDetailsComponent.setAlreadyWatchedClickListener(() => {
      const newFilm = Movie.clone(film);
      newFilm.isInHistory = !film.isInHistory;

      this._onDataChange(this, film, newFilm);
    });

    this._filmDetailsComponent.setAddToFavouriteClickListener(() => {
      const newFilm = Movie.clone(film);
      newFilm.isInFavorites = !film.isInFavorites;

      this._onDataChange(this, film, newFilm);
    });

    this._filmDetailsComponent.setAddNewCommentListener((evt) => {
      this._filmDetailsComponent.getCommentInput().style.border = `none`;
      if (isCmdEnterKeysCode(evt)) {
        const newComment = this._filmDetailsComponent.getNewComment();
        // const form = this._filmDetailsComponent.getForm();

        if (newComment) {
          const newFilm = Movie.clone(film);

          this._api.createComment(newFilm.id, newComment)
            .then(() => {
              newFilm.comments.concat(newComment.id);
              const formELements = this._filmDetailsComponent.getFormElements();
              formELements.forEach((element) => {
                element.setAttribute(`disabled`, `disabled`);
              });

              this._onDataChange(this, film, newFilm);
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
      const deleteButton = this._filmDetailsComponent.getDeleteButton();
      const newFilm = Movie.clone(film);

      const commentElement = evt.target.closest(`.film-details__comment`);
      const removeCommentId = commentElement.dataset.commentId;

      this._api.deleteComment(removeCommentId)
        .then(() => {
          newFilm.comments = film.comments.filter((id) => {
            return id !== removeCommentId;
          });
          deleteButton.innerHTML = `Deleting...`;
          deleteButton.setAttribute(`disabled`, `true`);
        })
        .catch(() => {
          this._shakeComment(commentElement);
        });

      this._onDataChange(this, film, newFilm);
    });

    this._filmDetailsComponent.setEmojiClickListener((evt) => {
      const currentEmoji = evt.target.value;
      const emojiContainer = this._filmDetailsComponent.getEmojiContainer();
      emojiContainer.innerHTML = `<img src="images/emoji/${currentEmoji}.png" width="55" height="55" alt="emoji-${currentEmoji}">`;
    });

    if (oldFilmDetailsComponent && oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._filmCardComponent);
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

  shake() {
    this._filmDetailsComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_COUNT}s`;
    this._filmCardComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_COUNT}s`;

    setTimeout(() => {
      this._filmDetailsComponent.getElement().style.animation = ``;
      this._filmCardComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _shakeComment(currentComment) {
    currentComment.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_COUNT}s`;

    setTimeout(() => {
      currentComment.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _addCommentFieldBorder() {
    this._filmDetailsComponent.getCommentInput().style.border = `2px solid red`;
    this._filmDetailsComponent.getCommentInput().removeAttribute(`disabled`);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closeFilmDetails();
    }
  }
}
