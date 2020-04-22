import {createElement} from "../../util/dom-util";
import {getPlurals, getFullDate} from "../../util/util";

const CARD_CONTROLS = new Map([
  [`watchlist`, `Add to watchlist`],
  [`watched`, `Already watched`],
  [`favorite`, `Add to favorites`]
]);

const EMOJIS = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

export default class FilmDetails {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  _getGenresMarkup() {
    return this._film.genres.reduce((prev, item) => {
      return (
        `${prev}<span class="film-details__genre">${item}</span>`
      );
    }, ``);
  }

  _getFilmDetails() {
    const dataList = [
      {
        name: `Director`,
        value: this._film.director
      },
      {
        name: getPlurals(this._film.writers.length, [`Writer`, `Writers`]),
        value: this._film.writers
      },
      {
        name: getPlurals(this._film.actors.length, [`Actor`, `Actors`]),
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
        name: getPlurals(this._film.genres.length, [`Genre`, `Genres`]),
        value: this._getGenresMarkup()
      },
    ];

    const rowsMarkup = dataList
      .reduce((prev, {name, value}) => {
        return (
          `${prev}<tr class="film-details__row">
            <td class="film-details__term">${name}</td>
            <td class="film-details__cell">${value}</td>
          </tr>`
        );
      }, ``);

    return (
      `<table class="film-details__table">
        ${rowsMarkup}
      </table>`
    );
  }

  _getComments() {
    return (
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" checked>
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>`
    );
  }

  _getEmojiControls() {
    return EMOJIS.map((emoji) =>
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
        <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji ${emoji}">
      </label>`
    ).join(`\n`);
  }

  _getCardControls() {
    let markup = ``;
    CARD_CONTROLS.forEach((value, key) => {
      markup +=
      `<input type="checkbox" class="film-details__control-input visually-hidden" id="${key}" name="${key}">
      <label for="${key}" class="film-details__control-label film-details__control-label--${key}">${value}</label>`;
    });

    return markup;
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
              <img class="film-details__poster-img" src="./images/posters/${this._film.poster}" alt="">

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
            ${this._getCardControls()}
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._film.comments.length}</span></h3>

            <ul class="film-details__comments-list"></ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
                <img src="images/emoji/smile.png" width="55" height="55" alt="emoji-smile">
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">Great movie!</textarea>
              </label>

              <div class="film-details__emoji-list">
                ${this._getEmojiControls()}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
