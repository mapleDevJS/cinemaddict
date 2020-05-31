import AbstractComponent from "./abstract-component";

export default class Footer extends AbstractComponent {
  constructor(totalMovies) {
    super();

    this._totalMovies = totalMovies;
  }

  getTemplate() {
    return (
      `<footer class="footer">
        <section class="footer__logo logo logo--smaller">Cinemaddict</section>
        <section class="footer__statistics">
          <p>${this._totalMovies} movies inside</p>
        </section>
      </footer>`
    );
  }
}
