import {createFilmCard} from "../components/film-card";

let SECTION_NAMES = new Map([
  [`rating`, `Top Rated`],
  [`comments`, `Most commented`]
]
);

const sortArrayOfObjectsByKey = (key, order = `desc`) => {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === `string`) ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === `string`) ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === `desc`) ? (comparison * -1) : comparison
    );
  };
};

const createFilmCards = (films, quantity) => {
  let markup = ``;
  for (let i = 0; i < quantity; i++) {
    markup += createFilmCard(films[i]);

  }
  return markup;
};

const getTopFilms = (films, key) => {
  return films.sort(sortArrayOfObjectsByKey(key)).slice(0, 2);
};

const createSectionMarkup = (name, filmCards) => {
  return (
    `<section class="films-list--extra">
        <h2 class="films-list__title">${name}</h2>
        <div class="films-list__container">
          ${filmCards}
        </div>
    </section>`);
};

export const createExtraSections = (films) => {
  let markup = ``;
  let filmCards = ``;
  for (let [key, value] of SECTION_NAMES) {
    filmCards = createFilmCards(getTopFilms(films, key), 2);
    markup += createSectionMarkup(value, filmCards);
  }
  return markup;
};
