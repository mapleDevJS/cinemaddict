import {createFilmCard} from "./film-card.js";
import {createButtonShowMore} from "./button-showmore.js";
import {createFilmExtra} from "./film-list-extra.js";

const Count = {
  FILM: 5,
  EXTRA_SECTION: 2
};

const getFilmCards = () => {
  let markup = ``;
  for (let i = 0; i < Count.FILM; i++) {
    markup += createFilmCard();
  }
  return markup;
};

const getFilmExtras = () => {
  let markup = ``;
  for (let i = 0; i < Count.EXTRA_SECTION; i++) {
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
