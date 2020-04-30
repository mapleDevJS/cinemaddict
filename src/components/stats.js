import Abstract from "./abstract";

export default class Stats extends Abstract {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return (
      `<p>${this._films.length} movies inside</p>`
    );
  }
}
