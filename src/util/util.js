import moment from "moment";
import {MINUTES_IN_HOUR} from "./consts";

export const getRandomBoolean = () => Math.random() > 0.5;

export const getRandomItem = (array) => {
  return array.length === 1 ? array : shuffle(array.slice()).shift();
};

export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const shuffle = (array) => {
  let j;

  for (let i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    [array[j], array[i]] = [array[i], array[j]];
  }

  return array;
};

export const pluralize = (count, variants) => {
  return (count === 1) ? variants[0] : variants[1];
};

export const getDateFromString = (date) => {
  return new Date(date).valueOf();
};

export const getFullDate = (date) => {
  return moment(date).format(`Do MMMM YYYY`);
};

export const getDuration = (timeInMinutes) => {
  return timeInMinutes >= MINUTES_IN_HOUR
    ? moment.utc(moment.duration(timeInMinutes, `minutes`).asMilliseconds()).format(`h[h] mm[m]`)
    : `${timeInMinutes}m`;
};
