const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomElem = (arr) => {
  return arr[randomInt(0, arr.length - 1)];
}

const randomSubstring = (string, length) => {
  let substr = '';
  for (var i = 0; i < length; i++) {
    substr = substr + randomElem(string);
  }
  return substr;
}

module.exports = {
  randomInt,
  randomElem,
  randomSubstring
}
