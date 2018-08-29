const cp = require("child_process"),
  fs = require('fs'),
  inquirer = require('inquirer'),
  genConfig = require('./genConfig'),
  GenHelper = require('./GenHelper'),
  GenFiles = require('./GenFiles');

class Generator extends GenFiles {
  constructor() {
    super();
    this._questions = GenHelper.safeClone(genConfig.questions);
    this._databaseInfo = require('../database');
    this._databaseImport = {file: ''};
    this._paths = {
      sql: GenHelper.getSqlPath()
    };
  }

  askForTables() {
    let prompt = inquirer.createPromptModule();

    return new Promise(async (resolve, reject) => {
      let answers = await prompt(this._questions.database);

      GenHelper.setAnswers(this._databaseImport, answers);
      await this.createTables();

      resolve();
    });
  }

  /**
   * Create tables in the database.
   *
   * @async
   * @returns {Promise}
   */
  createTables() {
    let command = 'mysql',
      file = this._databaseImport.file;

    if (this._databaseInfo.user) command += ` --user=${this._databaseInfo.user}`;
    if (this._databaseInfo.password) command += ` --password=${this._databaseInfo.password}`;

    command += ` ${this._databaseInfo.database} < ../${file}.sql`;

    return new Promise((resolve, reject) => {
      cp.exec(command, function (error, stdout, stderr) {
        let database = `%yes% Successfully generated tables from ${file}.sql`;

        if (error) database = `%yes% Unable to generate tables`;

        console.log(GenHelper.coloredString(database));
        resolve();
      });
    });
  }

  getNodePath() {
    let command = 'whereis node';

    return new Promise((resolve, reject) => {
      cp.exec(command, (error, stdout, stderr) => {
        if (error) reject('Cannot find location of \'node\'');

        let output = stdout.split(' ');

        if (output.length < 2) reject('Cannot find location of \'node\'');

        resolve(output[1]);
      });
    });
  }

  getBotPath() {
    let directories = __dirname.split('/');

    directories.pop();

    return directories.join('/');
  }

  getLogPath() {
    let botPath = this.getBotPath();

    return botPath + '/logs';
  }

  createServiceFile() {
    return new Promise(async (resolve, reject) => {
      let nodePath = await this.getNodePath(),
        botPath = this.getBotPath() + '/index.js',
        logPath = this.getLogPath() + '/service.log',
        content = await this.genService(nodePath, botPath, logPath),
        targetPath = '/lib/systemd/system/marlubot.service';

      fs.writeFile(targetPath, content, (error) => {
        if (error) {
          console.log('Unable to create service file');
          reject();
        }

        resolve();
      });
    });
  }
}

module.exports = Generator;