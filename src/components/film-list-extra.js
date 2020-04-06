import {renderFilmCards} from "./film-card.js";
import {QUANTITY_FILMS_IN_EXTRA_SECTION} from "./film-card.js";

export const QUANTITY_FILMEXTRA_SECTIONS = 2;

export const createFilmExtra = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
        ${renderFilmCards(QUANTITY_FILMS_IN_EXTRA_SECTION)}
      </div>
    </section>`
  );
};
