import {MONTH_NAMES} from "../util/consts";

const RenderPosition = {
  AFTER_END: `afterend`,
  BEFORE_END: `beforeend`
};

export const getRandomBoolean = () => Math.random() > 0.5;

const getRandomIntegerNumber = (max) => {
  return Math.floor(Math.random() * max);
};


export const getRandomItem = (array) => {
  return shuffle(array.slice()).shift();
};

export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (array) => {
  let j;

  for (let i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    [array[j], array[i]] = [array[i], array[j]];
  }

  return array;
};

export const getPlurals = (count, variants) => {
  return (count === 1) ? variants[0] : variants[1];
};

export const getFullDate = (date) => {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export const sortArrayOfObjectsByKey = (key, order = `desc`) => {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === `string`) ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === `string`) ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === `desc`) ? (comparison * -1) : comparison
    );
  };
};

export const render = (container, element, place = RenderPosition.BEFORE_END) => {
  switch (place) {
    case RenderPosition.AFTER_END:
      container.prepend(element);
      break;
    case RenderPosition.BEFORE_END:
      container.append(element);
      break;
  }
};
