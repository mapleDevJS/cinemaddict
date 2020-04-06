import {QUANTITY_FILMS_IN_CARD} from "./film-card.js";
import {QUANTITY_FILMEXTRA_SECTIONS} from "./film-list-extra.js";
import {renderFilmCards} from "./film-card.js";
import {createButtonShowMore} from "./button-showmore.js";
import {createFilmExtra} from "./film-list-extra.js";

const renderFilmExtras = (sectionQuntity) => {
  let markup = ``;
  for (let i = 0; i < sectionQuntity; i++) {
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
          ${renderFilmCards(QUANTITY_FILMS_IN_CARD)}
        </div>
        ${createButtonShowMore()}
      </section>
      ${renderFilmExtras(QUANTITY_FILMEXTRA_SECTIONS)}
    </section>`
  );
};
