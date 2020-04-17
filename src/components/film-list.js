import {createButtonShowMore} from "./button-showmore.js";
import {createExtraSections} from "./film-list-extra.js";

export const createFilmList = (films, filmCards, onShowMoreButtonClick) => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
        <div class="films-list__container">
          ${filmCards}
        </div>
        ${createButtonShowMore(onShowMoreButtonClick)}
      </section>
      ${createExtraSections(films)}
    </section>`
  );
};
