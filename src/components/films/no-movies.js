import AbstractComponent from "../abstract";

export default class NoMovies extends AbstractComponent {
  getTemplate() {
    return (
      `<section class="films-list">
        <h2 class="films-list__title">There are no movies in our database</h2>
      </section>`
    );
  }
}
