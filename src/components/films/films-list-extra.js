import Abstract from "../abstract";

export default class FilmsListExtra extends Abstract {
  constructor(title) {
    super();
    this._title = title;

    this.filmsListContainer = this.getElement().querySelector(`.films-list__container`);
  }

  getTemplate() {
    return (
      `<section class="films-list--extra">
        <h2 class="films-list__title">${this._title}</h2>
        <div class="films-list__container"></div>
      </section>`
    );
  }
}
