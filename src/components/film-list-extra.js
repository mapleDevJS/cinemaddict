import {renderFilmCards} from "./film-card.js";

const QUANTITY_FILMS_IN_CARD = 2;

export const createFilmExtra = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
        ${renderFilmCards(QUANTITY_FILMS_IN_CARD)}
      </div>
    </section>`
  );
};
