import AbstractSmartComponent from "../abstract-smart-component";
import {encode} from 'he';
import moment from "moment";
import {getFullDate, getDuration, pluralize} from "../../util/util";
import {createElement} from "../../util/dom-util";
import {SHAKE_ANIMATION_TIMEOUT, MILLISECONDS_COUNT} from "../../util/consts";

const CARD_CONTROLS = [
  [`isInWatchlist`, `watchlist`, `Add to watchlist`],
  [`isInHistory`, `watched`, `Mark as watched`],
  [`isInFavorites`, `favorite`, `Mark as favorite`]
];

const EMOJIS = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

const PROGRESS_DELETE_BUTTON = `Deleting...`;

export default class FilmDetails extends AbstractSmartComponent {
  constructor(movie, comments) {
    super();

    this._movie = movie;
    this._comments = comments;

    this._currentEmoji = null;

    this._formElements = this.getElement().querySelectorAll(`button, input, textarea`);
    this._commentInput = this.getElement().querySelector(`.film-details__comment-input`);

    this._commentDeleteClickListener = null;
    this._onCommentDeleteButtonClick = this._onCommentDeleteButtonClick.bind(this);
    this._onEmojiClickListener = this._onEmojiClickListener.bind(this);
  }

  recoverListeners() {
    this.setCloseButtonClickListener(this.closeButtonClickListener);
    this.setAddToWatchlistClickListener(this.addToWatchlistClickListener);
    this.setAlreadyWatchedClickListener(this.alreadyWatchedClickListener);
    this.setAddToFavouriteClickListener(this.addToFavouriteClickListener);
    this.setAddNewCommentListener(this.addNewCommentListener);
    this.setDeleteCommentClickListener(this._commentDeleteClickListener);
    this._setEmojiClickListener(this._onEmojiClickListener);
  }

  getTemplate() {
    return (
      `<section class="film-details">
        <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${this._movie.poster}" alt="">
              <p class="film-details__age">${this._movie.age}+</p>
            </div>
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${this._movie.title}</h3>
                  <p class="film-details__title-original">${this._movie.original}</p>
                </div>
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${this._movie.rating}</p>
                </div>
              </div>
              <table class="film-details__table">
                ${this._getMovieDetails()}
              </table>
              <p class="film-details__film-description">
                ${this._movie.description}
              </p>
            </div>
          </div>
          <section class="film-details__controls">
            ${this._getButtonsMarkup()}
          </section>
        </div>
        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._movie.comments.length}</span></h3>
            <ul class="film-details__comments-list">
              ${this._getComments()}
            </ul>
            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
              <div class="film-details__emoji-list">
                ${this._getEmojiMarkup()}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
    );
  }
  setCloseButtonClickListener(listener) {
    this.closeButtonClickListener = listener;
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this.closeButtonClickListener);
  }

  setAddToWatchlistClickListener(listener) {
    this.addToWatchlistClickListener = listener;
    this.getElement().querySelector(`#watchlist`)
      .addEventListener(`click`, this.addToWatchlistClickListener);
  }

  setAlreadyWatchedClickListener(listener) {
    this.alreadyWatchedClickListener = listener;
    this.getElement().querySelector(`#watched`)
      .addEventListener(`click`, this.alreadyWatchedClickListener);
  }

  setAddToFavouriteClickListener(listener) {
    this.addToFavouriteClickListener = listener;
    this.getElement().querySelector(`#favorite`)
      .addEventListener(`click`, this.addToFavouriteClickListener);
  }

  setAddNewCommentListener(listener) {
    const textCommentElement = this._element.querySelector(`.film-details__comment-input`);
    textCommentElement.addEventListener(`keydown`, listener);

    this.addNewCommentListener = listener;
  }

  setDeleteCommentClickListener(listener) {
    this._commentDeleteClickListener = listener;

    const commentButtonList = this._element.querySelectorAll(`.film-details__comment-delete`) || [];

    Array.from(commentButtonList).forEach((button) => button.addEventListener(`click`, this._onCommentDeleteButtonClick));
  }

  getNewComment() {
    const emojiElement = this.getElement().querySelector(`.film-details__add-emoji-label`).firstElementChild;

    const emotion = emojiElement ? emojiElement.alt.substring((`emoji-`).length) : null;

    const newComment = encode(this.getElement().querySelector(`.film-details__comment-input`).value);

    if (!emotion || !newComment) {
      return null;
    } else {
      return {
        comment: newComment,
        emotion,
        date: new Date()
      };
    }
  }

  setCommentFormValid(isValid) {
    this._commentInput.style.border = (isValid) ? `2px solid red` : `none`;
  }

  setFormLocked(locked) {
    if (locked) {
      this._formElements.forEach((element) => {
        element.setAttribute(`disabled`, `disabled`);
      });
    } else {
      this._commentInput.removeAttribute(`disabled`);
    }
  }

  shake() {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_COUNT}s`;

    setTimeout(() => {
      this._resetShaking();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  getCommentId(evt) {
    const commentElement = evt.target.closest(`.film-details__comment`);
    return commentElement.dataset.commentId;
  }

  _setProgressForDeleteButton(button) {
    button.innerHTML = PROGRESS_DELETE_BUTTON;
  }

  _setEmojiClickListener(listener) {
    this.emojiClickListener = listener;
    this.getElement().querySelector(`.film-details__emoji-list`)
    .addEventListener(`change`, this.emojiClickListener);
  }

  _resetShaking() {
    this.getElement().style.animation = ``;
  }

  _getCommentMarkup({id, author, comment, date, emotion}) {
    return (
      `<li class="film-details__comment" data-comment-id="${id}">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
          </span>
          <div>
            <p class="film-details__comment-text">${comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${moment(date).fromNow()}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`
    );
  }

  _getComments() {
    return this._comments.map(this._getCommentMarkup).join(`\n`);
  }

  _getGenresMarkup() {
    return this._movie.genres.map((genre) => {
      return (
        `<span class="film-details__genre">${genre}</span>`
      );
    }).join(`\n`);
  }

  _getMovieDetails() {
    const dataList = [
      {
        name: `Director`,
        value: this._movie.director
      },
      {
        name: pluralize(this._movie.writers.length, [`Writer`, `Writers`]),
        value: this._movie.writers
      },
      {
        name: pluralize(this._movie.actors.length, [`Actor`, `Actors`]),
        value: this._movie.actors.join(`, `)
      },
      {
        name: `Release`,
        value: getFullDate(this._movie.release)
      },
      {
        name: `Runtime`,
        value: getDuration(this._movie.runtime)
      },
      {
        name: `Country`,
        value: this._movie.country
      },
      {
        name: pluralize(this._movie.genres.length, [`Genre`, `Genres`]),
        value: this._getGenresMarkup()
      },
    ];

    return dataList
      .map(({name, value}) => {
        return (
          `<tr class="film-details__row">
            <td class="film-details__term">${name}</td>
            <td class="film-details__cell">${value}</td>
          </tr>`
        );
      }).join(`\n`);
  }

  _getEmoji(emoji) {
    return (
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
        <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji ${emoji}">
      </label>`
    );
  }

  _getEmojiMarkup() {
    return EMOJIS.map((emoji) =>
      this._getEmoji(emoji)
    ).join(`\n`);
  }

  _getCurrentEmojiMarkup() {
    if (this._currentEmoji) {
      return (`<img src="images/emoji/${this._currentEmoji}.png" width="55" height="55" alt="emoji-${this._currentEmoji}"></img>`);
    } else {
      return ``;
    }
  }

  _isChecked(checkingClass) {
    return this._movie[checkingClass] ? `checked` : ``;
  }

  _getButton(checkingClass, key, value) {
    return (
      `<input type="checkbox" class="film-details__control-input visually-hidden" id="${key}" name="${key}" ${this._isChecked(checkingClass)}>
      <label for="${key}" class="film-details__control-label film-details__control-label--${key}">${value}</label>`
    );
  }

  _getButtonsMarkup() {
    return CARD_CONTROLS
      .map(([checkingClass, key, value]) => this._getButton(checkingClass, key, value))
      .join(`\n`);
  }

  _onCommentDeleteButtonClick(evt) {
    evt.preventDefault();

    this._setProgressForDeleteButton(evt.target);

    if (typeof this._commentDeleteClickListener === `function`) {
      this._commentDeleteClickListener(evt);
    }
  }

  _onEmojiClickListener(evt) {
    this._currentEmoji = evt.target.value;

    const emojiContainer = this.getElement().querySelector(`.film-details__add-emoji-label`);

    if (emojiContainer.firstElementChild) {
      emojiContainer.removeChild(emojiContainer.firstElementChild);
    }

    emojiContainer.appendChild(createElement(this._getCurrentEmojiMarkup()));
  }
}
