import {createFilmCard} from "./film-card.js";

const FILM_EXTRA_COUNT = 2;

const getFilmCards = () => {
  let markup = ``;
  for (let i = 0; i < FILM_EXTRA_COUNT; i++) {
    markup += createFilmCard();
  }
  return markup;
};

export const createFilmExtra = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
        ${getFilmCards()}
      </div>
    </section>`
  );
};
