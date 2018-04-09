// Import modules.
const fs = require('fs'),

  // Import custom modules.
  Helper = require(`${__dirname}/Helper`);

let instance = null;

/**
 * This class prints every output and debugging information into the log file and/or the console.
 *
 * @returns {Log} Returns the Output instance.
 */
class Log {

  /**
   * @see Output
   */
  constructor() {
    // The class Output is a singleton class.
    if (instance instanceof Log) return instance;
    if (!(this instanceof Log)) return new Log();

    this.logger = null;
    this.logFileName = 'log';
    this.logPath = `${__dirname}../logs`;

    instance = this;
    return this;
  }

  /**
   * Initiate the log file and open a write stream.
   */
  initLogger() {
    let path = this.logPath,
      name = this.logFileName;

    // Create the directory if not exists.
    if (!fs.existsSync(path)) fs.mkdirSync(path);

    // Add the file name to the path.
    path += `/${name}.log`;

    // Remove the old log file if exists.
    if (fs.existsSync(path)) fs.unlinkSync(path);

    // Open the write stream.
    this.logger = fs.createWriteStream(path, {flags: 'a'});
    this.write(`Started at: ${new Date()}`, true, 'success');
  }

  /**
   * Write output.
   *
   * @param {string} value The value that should be printed.
   * @param {boolean} [toConsole=false] Print to console.
   * @param {string} [type=] The type or color of the value.
   * @param {string} [background=] The background color of the value.
   */
  write(value, toConsole = false, type = '', background = '') {
    this.logger.write(value + "\r\n");

    this.writeConsole(value, toConsole, type, background);
  }

  /**
   * Write output with a new line before.
   *
   * @param {string} value The value that should be printed.
   * @param {boolean} [toConsole=false] Print to console.
   * @param {string} [type=] The type or color of the value.
   * @param {string} [background=] The background color of the value.
   */
  writeLine(value, toConsole = false, type = '', background = '') {
    this.logger.write("\r\n");
    if (toConsole) console.log();

    this.write(value, toConsole, type, background);
  }

  /**
   * Write output with a trailing new line.
   *
   * @param {string} value The value that should be printed.
   * @param {boolean} [toConsole=false] Print to console.
   * @param {string} [type=] The type or color of the value.
   * @param {string} [background=] The background color of the value.
   */
  writeWithSpace(value, toConsole = false, type = '', background = '') {
    this.write(value, toConsole, type, background);
    this.logger.write("\r\n");
    if (toConsole) console.log();
  }

  /**
   * Write in console only.
   *
   * @param {*} value The value that should be printed.
   * @param {boolean} [toConsole=false] Print to console.
   * @param {string} [type=] The type or color of the value.
   * @param {string} [background=] The background color of the value.
   */
  writeConsole(value, toConsole = false, type = '', background = '') {
    if (!toConsole) return;

    if (type.length < 1) {
      console.log(value);
      return;
    }

    if (background.length < 1) {
      console.log(Helper.getColor(type), value);
      return;
    }

    console.log(Helper.getColor(type, background), ` ${value} `);
  }

  /**
   * Write array as strings with new line for each entry.
   *
   * @param {object[]} sentences An array of objects stored with default write information.
   * @param {string} sentences[].text The text that should be printed.
   * @param {string} [sentences[].type=] The type or color of the text.
   * @param {string} [sentences[].background=] The background color of the text.
   * @param {string} [type=] The type or color of the first text.
   */
  writeOutput(sentences, type = '') {
    this.writeLine(sentences[0].text, true, type);

    for (let i = 1; i < sentences.length; i += 1) {
      let color = sentences[i].color || '',
        bg = sentences[i].bg || '';

      if (sentences.length !== (i + 1)) {
        this.write(sentences[i].text, true, color, bg);
        continue;
      }

      this.writeWithSpace(sentences[i].text, true, color, bg);
    }
  }
}

module.exports = new Log();

Helper.booted(__filename);