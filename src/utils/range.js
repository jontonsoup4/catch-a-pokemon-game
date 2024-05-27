export const minMax = (value, min, max) => Math.min(Math.max(value, min), max);
export const getRandomInt = (max, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
export const getRandomElement = (arr) => arr[getRandomInt(arr.length - 1)];
