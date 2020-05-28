import Abstract from "./abstract";

export default class Header extends Abstract {
  getTemplate() {
    return (
      `<header class="header">
          <h1 class="header__logo logo">Cinemaddict</h1>
        </header>`
    );
  }
}
