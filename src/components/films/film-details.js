import {pluralize, getFullDate} from "../../util/util";
import Abstract from "../abstract";

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

// const FilmInfo = {
//   director: `Director`,
//   writers: `Writer`,
//   actors: `Actor`,
//   release: `Release`,
//   runtime: `Runtime`,
//   country: `Country`,
//   genres: `Genre`
// };

export default class FilmDetails extends Abstract {
  constructor(film) {
    super();
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


    // return Object.keys(FilmInfo)
    //   .map((key) => {
    //     return (
    //       `<tr class="film-details__row">
    //          <td class="film-details__term">${FilmInfo[key]}</td>
    //          <td class="film-details__cell">${this._film[key]}</td>
    //       </tr>`
    //     );
    //   }).join(`\n`);

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

  _getButton(key, value) {
    return (
      `<input type="checkbox" class="film-details__control-input visually-hidden" id="${key}" name="${key}">
      <label for="${key}" class="film-details__control-label film-details__control-label--${key}">${value}</label>`);
  }

  _getButtonsMarkup() {
    return [...CARD_CONTROLS.entries()]
      .map(([value, key]) => this._getButton(value, key))
      .join(`\n`);
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
            ${this._getButtonsMarkup()}
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
                ${this._getEmojiMarkup()}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
    );
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);
  }
}
