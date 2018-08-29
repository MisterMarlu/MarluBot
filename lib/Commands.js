const Helper = require('./Helper'),
  ModuleManager = require('./ModuleManager'),
  Log = require('./Log'),
  CommandList = require('./CommandList'),
  BotManager = require('./BotManager'),
  packageFile = JSON.parse(JSON.stringify(require('../package')));

let _message = null;

class Commands {

  /**
   * Get the message object.
   *
   * @returns {object}
   */
  static get message() {
    return _message;
  }

  /**
   * Set the message object.
   *
   * @param {object} message
   */
  static set message(message) {
    _message = message;
  }

  /**
   * Executes the command.
   *
   * @param message
   * @param command
   * @param args
   * @param secure
   */
  static do(message, command, args, secure = true) {
    let method = Helper.dashToCamel(command);

    if (method === 'debug') {
      if (NO_DEBUG) return;

      command = args.shift();
      Commands.debug(message, command, args);
      return;
    }

    let user = message.author,
      log = `[Command] from [${user.username} (${user.id})] ${command} ${args.join(' ')}`;

    if (!secure) log = `[Debug] ${log}`;

    Log.write(log, true);

    if (typeof Commands[method] === 'function' && typeof CommandList[method] === 'function') {
      try {
        Commands[method](message, args);
      } catch (e) {
        Log.write(`[Exception] Unable to run command ?${command} ${args.join(' ')}`, true);
        console.error(e);
      }
      return;
    }

    if (ModuleManager.isCommand(method, secure)) {
      ModuleManager.do(method, message, args, secure);
      return;
    }

    if (!secure) {
      if (typeof Commands[method] === 'function') {
        Commands[method](message, args);
        return;
      }
    }

    message.reply(__('core_noCommand', command));
  }

  /**
   * Get information about this bot.
   *
   * @param message
   * @param args
   */
  static info(message, args) {
    let time = BotManager.upTime;

    message.channel.send(__('core_info', time.days, time.hours, time.minutes, time.seconds, packageFile.version));
  }

  /**
   * Get the current version of this bot.
   *
   * @param message
   */
  static version(message) {
    message.channel.send(packageFile.version);
  }

  /**
   * Debug any command.
   *
   * @param message
   * @param command
   * @param args
   */
  static debug(message, command, args) {
    if (message.author.username !== 'MisterMarlu') return;

    Commands.do(message, command, args, false);
  }

  /**
   * Get all available commands.
   *
   * @param message
   * @param args
   */
  static getCommands(message, args) {
    message.channel.send(ModuleManager.commandList());
  }
}

module.exports = Commands;

Helper.booted(__filename);