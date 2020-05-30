import AbstractComponent from "./abstract-component";

export default class Header extends AbstractComponent {
  getTemplate() {
    return (
      `<header class="header">
          <h1 class="header__logo logo">Cinemaddict</h1>
        </header>`
    );
  }
}
