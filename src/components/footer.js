import AbstractComponent from "./abstract-component";

export default class Footer extends AbstractComponent {
    constructor(totalMoviesCount) {
        super();
        this._totalMoviesCount = totalMoviesCount;
    }

    getTemplate() {
        return (
            `<footer class="footer">
        <section class="footer__logo logo logo--smaller">Cinemaddict</section>
        <section class="footer__statistics">
          <p>${this._totalMoviesCount} movies inside</p>
        </section>
      </footer>`
        );
    }
}
