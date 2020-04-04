import {createFilmCard} from "./film-card.js";
import {createButtonShowMore} from "./button-showmore.js";
import {createFilmExtra} from "./film-list-extra.js";

const QUANTITY_FILMS_IN_CARD = 5;
const QUANTITY_FILMEXTRA_SECTIONS = 2;

const getFilmCards = () => {
  let markup = ``;
  for (let i = 0; i < QUANTITY_FILMS_IN_CARD; i++) {
    markup += createFilmCard();
  }
  return markup;
};

const getFilmExtras = () => {
  let markup = ``;
  for (let i = 0; i < QUANTITY_FILMEXTRA_SECTIONS; i++) {
    markup += createFilmExtra();
  }
  return markup;
};

export const createFilmList = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
        <div class="films-list__container">
          ${getFilmCards()}
        </div>
        ${createButtonShowMore()}
      </section>
      ${getFilmExtras()}
    </section>`
  );
};
