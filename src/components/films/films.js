import Abstract from "../abstract";

export default class Films extends Abstract {
  constructor() {
    super();

    this.filmsElement = this.getElement();
  }

  getTemplate() {
    return (
      `<section class="films"></section>`
    );
  }
}
