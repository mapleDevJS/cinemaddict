import AbstractComponent from "./abstract-component";

export default class Footer extends AbstractComponent {
  constructor(moviesModel) {
    super();

    this._moviesModel = moviesModel;
  }

  getTemplate() {
    return (
      `<footer class="footer">
        <section class="footer__logo logo logo--smaller">Cinemaddict</section>
        <section class="footer__statistics">
          <p>${this._moviesModel.movies.length} movies inside</p>
        </section>
      </footer>`
    );
  }
}
