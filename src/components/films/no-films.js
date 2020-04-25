import Abstract from "../abstract";

export default class NoFilms extends Abstract {
  getTemplate() {
    return `<h2 class="films-list__title">There are no movies in our database</h2>`;
  }
}
