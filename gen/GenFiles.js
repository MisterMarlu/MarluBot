const fs = require('fs'),
  cp = require("child_process"),
  inquirer = require('inquirer'),
  GenHelper = require('./GenHelper'),
  genConfig = require('./genConfig');

/**
 * Class that generates files from stub.
 */
class GenFiles {

  constructor() {
    this._replacements = GenHelper.safeClone(genConfig.replacements);
  }

  /**
   * Generate correct content from stub file.
   *
   * @param {string} stubFile Name of the stub file with extension.
   * @returns {string} Returns the generated content as string.
   */
  genContent(stubFile) {
    let stub = fs.readFileSync(`${__dirname}/stubs/${stubFile}`),
      lines = stub.toString().split("\r\n");

    for (let i = 0; i < lines.length; i += 1) {
      for (let j = 0; j < this._replacements.length; j += 1) {
        lines[i] = GenHelper.replace(lines[i], this._replacements[j]);
      }
    }

    return lines.join("\r\n");
  }

  interpretFile(filePath, loops = {}) {
    let stub = fs.readFileSync(filePath),
      lines = stub.toString().split("\r\n"),
      newLines = [],
      loopLines = [],
      loopType = '',
      inLoop = false;

    for (let i = 0; i < lines.length; i += 1) {
      let line = lines[i];

      if (line.includes('%%loop')) {
        loopType = line.substring(line.lastIndexOf('=') + 1, line.lastIndexOf(';'));
        inLoop = true;
        continue;
      }

      if (line.includes('%%endloop')) {
        inLoop = false;

        if (!loops.hasOwnProperty(loopType)) continue;

        for (let j = 0; j < loops[loopType].length; j += 1) {
          for (let k = 0; k < loopLines.length; k += 1) {
            let replacement = {
              pattern: `%${loopType}%`,
              replacement: loops[loopType][j],
            };

            line = GenHelper.replace(loopLines[k], replacement);

            for (let j = 0; j < this._replacements.length; j += 1) {
              line = GenHelper.replace(line, this._replacements[j]);
            }

            newLines.push(line);
          }
        }

        loopType = '';
        continue;
      }

      if (inLoop) {
        loopLines.push(line);
        continue;
      }

      for (let j = 0; j < this._replacements.length; j += 1) {
        line = GenHelper.replace(line, this._replacements[j]);
      }

      newLines.push(line);
    }

    return newLines.join("\r\n");
  }

  /**
   *
   * Generate correct content for quick start.
   *
   * @param {string} nodePath
   * @param {string} botPath
   * @param {string} logPath
   * @returns {string} Returns the generated content as string.
   */
  async genService(nodePath, botPath, logPath) {
    let replacements = [
        {
          pattern: '%nodePath%',
          replacement: nodePath,
        },
        {
          pattern: '%botPath%',
          replacement: botPath,
        },
        {
          pattern: '%logPath%',
          replacement: logPath,
        },
      ],

      content = this.genContent('marlubot.service'),
      lines = content.split("\r\n");

    for (let i = 0; i < lines.length; i += 1) {
      for (let j = 0; j < replacements.length; j += 1) {
        lines[i] = GenHelper.replace(lines[i], replacements[j]);
      }
    }

    return lines.join("\r\n");
  }


  /**
   * Add a new replacement.
   *
   * @param {object} replacement The replacement object that should be added or updated.
   * @param {string} replacement.pattern The pattern for this replacement.
   * @param {*} replacement.replacement The replacement value.
   */
  addReplacement(replacement) {
    let exists = false;

    for (let i = 0; i < this._replacements.length; i += 1) {
      if (this._replacements[i].pattern !== replacement.pattern) continue;
      exists = true;
      this._replacements[i].replacement = replacement.replacement;
    }

    if (!exists) this._replacements.push(replacement);
  }

  /**
   * Add new replacements.
   *
   * @param {object[]} replacements The replacement objects that should be added or updated in an array.
   * @param {string} replacements[].pattern The pattern for this replacement.
   * @param {*} replacements[].replacement The replacement value.
   */
  addReplacements(replacements) {
    for (let i = 0; i < replacements.length; i += 1) {
      this.addReplacement(replacements[i]);
    }
  }

  /**
   * Deep replacing of strings in objects.
   *
   * @param {object} object An object where all strings should be replaced with a given pattern.
   */
  replaceObjectString(object) {
    for (let property in object) {
      if (!object.hasOwnProperty(property)) continue;
      if (typeof object[property] === 'object') {
        this.replaceObjectString(object[property]);
        continue;
      }

      if (typeof object[property] !== 'string') continue;

      for (let i = 0; i < this._replacements.length; i += 1) {
        object[property] = GenHelper.replace(object[property], this._replacements[i]);
      }
    }
  }
}

module.exports = GenFiles;