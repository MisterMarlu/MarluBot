'use strict';

/**
 * In this class are a lot of helping methods.
 */
class Helper {

  /**
   * Convert a one digit number into a two digit number.
   *
   * @param {number} number The number to convert.
   * @returns {string} Returns a two digit number as string.
   */
  static twoDigits(number) {
    return (number < 10) ? `0${number}` : number;
  }

  /**
   * Get a current MySQL timestamp.
   *
   * @param {Date} date A date object.
   * @returns {string} Returns the current MySQL timestamp.
   */
  static getSqlTimestamp(date = new Date()) {
    let Y = `${date.getFullYear()}`,
      m = `${Helper.twoDigits(1 + date.getMonth())}`,
      d = `${Helper.twoDigits(date.getDate())}`,
      h = `${Helper.twoDigits(date.getHours())}`,
      i = `${Helper.twoDigits(date.getMinutes())}`,
      s = `${Helper.twoDigits(date.getSeconds())}`;

    return `${Y}-${m}-${d} ${h}:${i}:${s}`;
  }

  /**
   * Converts the first letter of a string to upper case.
   *
   * @param {string} string
   * @returns {string}
   */
  static toUpperFirst(string) {
    if (typeof string !== 'string') {
      throw `The parameter must be type of "string", given is type of "${typeof string}"`;
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * Convert camelCase to snake_case.
   *
   * @param {string} camel
   * @returns {String}
   */
  static camelToUnderscore(camel) {
    return camel.replace(/\.?([A-Z])/g, function (x, y) {
      return "_" + y.toLowerCase()
    }).replace(/^_/, "");
  }

  /**
   * Convert dash-case to camelCase.
   *
   * @param {string} dash
   * @returns {String}
   */
  static dashToCamel(dash) {
    return dash.replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
  }

  /**
   * Convert snake_case to dash-case.
   *
   * @param {string} underscore
   * @returns {String}
   */
  static underscoreToDash(underscore) {
    return underscore.replace('_', '-');
  }

  /**
   * Convert camelCase to dash-case.
   *
   * @param {string} camel
   * @returns {String}
   */
  static camelToDash(camel) {
    let underscore = Helper.camelToUnderscore(camel);

    return Helper.underscoreToDash(underscore);
  }

  /**
   * Convert dash-case to snake_case.
   *
   * @param {string} dash
   * @returns {String}
   */
  static dashToUnderscore(dash) {
    let camel = Helper.dashToCamel(dash);

    return Helper.camelToUnderscore(camel);
  }

  /**
   * Convert snake_case to camelCase.
   *
   * @param {string} underscore
   * @returns {String}
   */
  static underscoreToCamel(underscore) {
    let dash = Helper.underscoreToDash(underscore);

    return Helper.dashToCamel(dash);
  }

  /**
   * Convert underscore to whitespaces.
   *
   * @param {string} underscore
   * @returns {String}
   */
  static underscoreToWhitespace(underscore) {
    return underscore.replace('_', ' ');
  }

  /**
   * @param {string} string
   * @param {*} value
   */
  static debugging(string, value) {
    if (!NO_DEBUG) Helper.console(string, value, 'debug');
  }

  /**
   * Write in console only.
   *
   * @param {string} string The string that should be printed.
   * @param {*} [value=] The value that should be printed.
   * @param {string} [type=] The type or color of the value.
   * @param {string} [background=] The background color of the value.
   */
  static console(string, value = null, type = '', background = '') {
    if (type.length < 1) {
      if (value === null) {
        console.log(string);
        console.log();
      } else {
        console.log(string, value);
        console.log();
      }
      return;
    }

    if (background.length < 1) {
      if (value === null) {
        console.log(Helper.getColor(type), ` ${string} `);
        console.log();
      } else {
        console.log(Helper.getColor(type), ` ${string} `, value);
        console.log();
      }
      return;
    }

    if (value === null) {
      console.log(Helper.getColor(type, background), ` ${string} `);
      console.log();
    } else {
      console.log(Helper.getColor(type, background), ` ${string} `, value);
      console.log();
    }
  }

  /**
   * Get colored command line output.
   *
   * @param {string} type The type or color of the value.
   * @param {string} [background=] The background color of the value.
   * @returns {string} Returns the colored string.
   */
  static getColor(type, background = '') {
    let colors = {
        reset: "\x1b[0m",
        bright: "\x1b[1m",
        dim: "\x1b[2m",
        underscore: "\x1b[4m",
        blink: "\x1b[5m",
        reverse: "\x1b[7m",
        hidden: "\x1b[8m",

        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",

        bgBlack: "\x1b[40m",
        bgRed: "\x1b[41m",
        bgGreen: "\x1b[42m",
        bgYellow: "\x1b[43m",
        bgBlue: "\x1b[44m",
        bgMagenta: "\x1b[45m",
        bgCyan: "\x1b[46m",
        bgWhite: "\x1b[47m",

        comment: "\x1b[90m"
      },
      string = '';

    colors.error = colors.red;
    colors.success = colors.green;
    colors.warning = colors.yellow;
    colors.default = colors.magenta;
    colors.debug = colors.cyan;

    if (colors.hasOwnProperty(type)) {
      string = colors[type] + '%s' + colors.reset;

      if (background.length > 0 && colors.hasOwnProperty(`bg${Helper.toUpperFirst(background)}`)) {
        string = colors[`bg${Helper.toUpperFirst(background)}`] + string;
      }
    }

    return string;
  }

  /**
   * Print the booted class.
   *
   * @param {string} filePath The absolute path to the class.
   */
  static booted(filePath) {
    let pathArray = filePath.split('/'),
      nameArray = pathArray[pathArray.length - 1].split(('.')),
      name = nameArray[0];

    Helper.console('Booted', name, 'success');
  }

  /**
   * Clones an object with the safest way, so the source object will not be touched.
   *
   * @param {object} source The object that should be cloned.
   * @returns {object} Returns a clone of the source object.
   */
  static safeClone(source) {
    return JSON.parse(JSON.stringify(source));
  }
}

exports.Helper = Helper;

Helper.booted(__filename);