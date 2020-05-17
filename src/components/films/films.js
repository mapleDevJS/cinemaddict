import Abstract from "../abstract";

export default class Films extends Abstract {
  getTemplate() {
    return (
      `<section class="films"></section>`
    );
  }

  getFilmsList() {
    return this.getElement().querySelector(`.films-list`);
  }

  getFilmsListContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
