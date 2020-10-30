module.exports = {
  splitWords
};

function splitWords(txt) {
  return txt
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/(-[AI])([A-Z][a-z])/g, '$1-$2')
    .split(/\W/g)
    .filter(v => !!v)
    .map(v => v.toLowerCase());
}
