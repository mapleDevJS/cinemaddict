import Filter from "../components/filter";
import {FilterType, MenuType, FilterNames} from "../util/filter";
import {replace} from "../util/dom-util";
import {getMoviesByFilter} from "../util/filter";

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;


    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setDataChangeListener(this._onDataChange);
  }

  render() {
    const container = this._container;
    const movies = this._moviesModel.getAllMovies();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        type: filterType,
        name: FilterNames[filterType.toUpperCase()],
        count: getMoviesByFilter(movies, filterType).length,
        active: filterType === this._activeFilterType,
      };
    });

    const menuItems = Object.values(MenuType).map((menuType) => {
      return {
        type: menuType,
        name: menuType.charAt(0).toUpperCase() + menuType.slice(1),
        active: menuType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new Filter(filters, menuItems);
    this._filterComponent.setFilterChangeListener(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
      this.setOnMenuItemClick(this._onMenuItemClick);
    } else {
      this._filterComponent.render(container);
    }
  }

  setOnMenuItemClick(listener) {
    this._filterComponent.setFilterChangeListener(listener);

    this._onMenuItemClick = listener;
  }

  _onFilterChange(filterType) {
    if (this._activeFilterType === filterType) {
      return;
    }

    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;

    this.render();
  }

  _onDataChange() {
    this.render();
  }
}
