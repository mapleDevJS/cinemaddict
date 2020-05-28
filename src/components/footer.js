import Abstract from "./abstract";

export default class Footer extends Abstract {
  constructor() {
    super();
    this._moviesInDatabase = ``;
  }

  getTemplate() {
    return (
      `<footer class="footer">
        <section class="footer__logo logo logo--smaller">Cinemaddict</section>
        <section class="footer__statistics">
          <p>${this._moviesInDatabase} movies inside</p>
        </section>
      </footer>`
    );
  }

  setMoviesInDatabase(movies) {
    this._moviesInDatabase = movies.length;
  }
}
