import {pluralize, getFullDate} from "../../util/util";
import AbstractSmart from "../abstract-smart";
import moment from "moment";
import {encode} from 'he';
import {getRandomName} from "../../mocks/films";

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

export default class FilmDetails extends AbstractSmart {
  constructor(film, comments) {
    super();

    this._film = film;
    this._comments = comments;
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
              <img class="film-details__poster-img" src="./${this._film.poster}" alt="">

              <p class="film-details__age">${this._film.age}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${this._film.title}</h3>
                  <p class="film-details__title-original">${this._film.original}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${this._film.rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                ${this._getFilmDetails()}
              </table>

              <p class="film-details__film-description">
                ${this._film.description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${this._getButtonsMarkup()}
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._film.comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${this._getComments()}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
                <img src="images/emoji/smile.png" width="55" height="55" alt="emoji-smile">
              </div>

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

  getEmojiContainer() {
    return this.getElement().querySelector(`.film-details__add-emoji-label`);
  }

  getNewComment() {
    const emojiElement = this.getElement().querySelector(`.film-details__add-emoji-label`).firstElementChild;
    const emojiName = emojiElement.alt.substring((`emoji-`).length);

    const comment = encode(this.getElement().querySelector(`.film-details__comment-input`).value);

    const emotion = emojiElement ? emojiName : ``;

    return {
      id: String(new Date() + Math.random()),
      comment,
      emotion,
      author: getRandomName(),
      date: new Date(),
    };
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

  setDeleteCommentClickListener(listener) {
    const commentButtonList = this._element.querySelectorAll(`.film-details__comment-delete`);

    if (commentButtonList) {
      Array.from(commentButtonList).forEach((button) => button.addEventListener(`click`, listener));
    }

    this.deleteButtonClickListener = listener;
  }

  setAddNewCommentListener(listener) {
    const textCommentElement = this._element.querySelector(`.film-details__comment-input`);
    textCommentElement.addEventListener(`keydown`, listener);

    this.addNewCommentListener = listener;
  }

  setEmojiClickListener(listener) {
    this.emojiClickListener = listener;
    this.getElement().querySelector(`.film-details__emoji-list`)
    .addEventListener(`change`, this.emojiClickListener);
  }

  recoverListeners() {
    this.setCloseButtonClickListener(this.closeButtonClickListener);
    this.setAddToWatchlistClickListener(this.addToWatchlistClickListener);
    this.setAlreadyWatchedClickListener(this.alreadyWatchedClickListener);
    this.setAddToFavouriteClickListener(this.addToFavouriteClickListener);
    this.setDeleteCommentClickListener(this.deleteButtonClickListener);
    this.setAddNewCommentListener(this.addNewCommentListener);
    this.setEmojiClickListener(this.emojiClickListener);
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
    return this._film.genres.map((genre) => {
      return (
        `<span class="film-details__genre">${genre}</span>`
      );
    }).join(`\n`);
  }

  _getFilmDetails() {
    const dataList = [
      {
        name: `Director`,
        value: this._film.director
      },
      {
        name: pluralize(this._film.writers.length, [`Writer`, `Writers`]),
        value: this._film.writers
      },
      {
        name: pluralize(this._film.actors.length, [`Actor`, `Actors`]),
        value: this._film.actors
      },
      {
        name: `Release`,
        value: getFullDate(this._film.release)
      },
      {
        name: `Runtime`,
        value: this._film.runtime
      },
      {
        name: `Country`,
        value: this._film.country
      },
      {
        name: pluralize(this._film.genres.length, [`Genre`, `Genres`]),
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

  _isChecked(checkingClass) {
    return this._film[checkingClass] ? `checked` : ``;
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
}
