import moment from "moment";
import {MINUTES_IN_HOUR} from "./consts";

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
