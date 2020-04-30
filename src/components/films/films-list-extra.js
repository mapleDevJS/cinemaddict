import Abstract from "../abstract";

export default class FilmsListExtra extends Abstract {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return (
      `<section class="films-list--extra">
        <h2 class="films-list__title">${this._title}</h2>
      </section>`
    );
  }
}
