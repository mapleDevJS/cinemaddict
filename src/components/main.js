import Abstract from "./abstract";

export default class Main extends Abstract {
  constructor() {
    super();
  }

  getTemplate() {
    return (
      `<main class="main"></main>`
    );
  }
}
