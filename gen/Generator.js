const cp = require("child_process"),
  inquirer = require('inquirer'),
  genConfig = require('./genConfig'),
  {GenHelper} = require('./GenHelper');

class Generator {
  constructor() {
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

    command += ` ${this._databaseInfo.database} < ${this._paths.sql}/${file}.sql`;

    return new Promise((resolve, reject) => {
      cp.exec(command, function (error, stdout, stderr) {
        let database = `%yes% Successfully generated tables from ${file}.sql`;

        if (error) database = `%yes% Unable to generate tables`;

        console.log(GenHelper.coloredString(database));
        resolve();
      });
    });
  }
}

exports.Generator = Generator;