const {de} = require('../lang/de'),
  {en} = require('../lang/en');

function translate(lang, string, args) {
  let translated = lang[string];

  for (let i = 0; i < args.length; i += 1) {
    translated = translated.replace('%s', args[i]);
  }

  return translated;
}

if (typeof t === 'undefined') {
  Object.defineProperty(global, 't', {
    get: function (string, args = []) {
      if (typeof de[string] !== 'undefined') return translate(de, string, args);
      if (typeof en[string] !== 'undefined') return translate(en, string, args);

      return `Missing translation for ${string}`;
    }
  });
}