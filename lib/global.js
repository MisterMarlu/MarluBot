const commands = require('minimist')(process.argv.slice(2)),
  i18n = require('i18n');

if (typeof NO_DEBUG === 'undefined') {
  /**
   * Define DEBUG for debugging.
   */
  Object.defineProperty(global, 'NO_DEBUG', {
    get: function () {
      if (typeof commands.noDebug === 'undefined') commands.noDebug = false;

      return commands.noDebug === 'true';
    }
  });
}

if (typeof LOCALE === 'undefined') {
  /**
   * Define LOCALE.
   */
  Object.defineProperty(global, 'LOCALE', {
    get: function () {
      if (typeof commands.locale === 'undefined') commands.locale = 'en';

      return commands.locale;
    }
  });
}

i18n.configure({
  locales: ['en', 'de'],
  directory: `${__dirname}/../locales`,
  register: global
});

i18n.setLocale(LOCALE);