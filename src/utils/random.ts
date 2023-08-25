export function randomNum(min: 0, max = Infinity) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
