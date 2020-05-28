import Abstract from "../abstract";

export default class NoMovies extends Abstract {
  getTemplate() {
    return (
      `<section class="films-list">
        <h2 class="films-list__title">There are no movies in our database</h2>
      </section>`
    );
  }
}
