import FilmDetails from "../components/films/film-details";
import FilmCard from "../components/films/film-card";
import {render, remove, replace} from "../util/dom-util";

export const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

const isCmdEnterKeysCode = (evt) => {
  return evt.code === `Enter` && (evt.ctrlKey || evt.metaKey);
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, commentsModel) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._commentsModel = commentsModel;

    this._mode = Mode.DEFAULT;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._body = document.querySelector(`body`);

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
      this._onDataChange(this, film, Object.assign({}, film, {
        isInWatchlist: !film.isInWatchlist,
      }));
    });

    this._filmCardComponent.setAlreadyWatchedClickListener(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isInHistory: !film.isInHistory,
        watchingDate: new Date()
      }));
    });

    this._filmCardComponent.setAddToFavouriteClickListener(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isInFavorites: !film.isInFavorites,
      }));
    });

    this._filmDetailsComponent.setCloseButtonClickListener(() => this._closeFilmDetails());

    this._filmDetailsComponent.setAddToWatchlistClickListener(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isInWatchlist: !film.isInWatchlist,
      }));
    });

    this._filmDetailsComponent.setAlreadyWatchedClickListener(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isInHistory: !film.isInHistory,
      }));
    });

    this._filmDetailsComponent.setAddToFavouriteClickListener(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isInFavorites: !film.isInFavorites,
      }));
    });

    this._filmDetailsComponent.setDeleteCommentClickListener((evt) => {
      evt.preventDefault();

      const commentElement = evt.target.closest(`.film-details__comment`);
      const removeCommentId = commentElement.dataset.commentId;

      const updatedComments = film.comments.filter((id) => {
        return id !== removeCommentId;
      });

      this._onDataChange(this, film, Object.assign({}, film, {comments: updatedComments}));
    });

    this._filmDetailsComponent.setAddNewCommentListener((evt) => {
      if (isCmdEnterKeysCode(evt)) {
        const comment = this._filmDetailsComponent.getNewComment();

        if (comment) {
          this._commentsModel.addComment(comment);
          const newCommentId = film.comments.concat(comment.id);
          this._onDataChange(this, film, Object.assign({}, film, {comments: newCommentId}));
        }
      }
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
    this._body.appendChild(this._filmDetailsComponent.getElement());
    this._mode = Mode.DETAILS;
    this._filmDetailsComponent.recoverListeners();
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _closeFilmDetails() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    remove(this._filmDetailsComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closeFilmDetails();
    }
  }
}
