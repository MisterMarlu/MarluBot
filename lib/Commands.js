const Helper = require('./Helper'),
  ModuleManager = require('./ModuleManager'),
  Log = require('./Log'),
  CommandList = require('./CommandList');

let _message = null;

class Commands {

  /**
   * @returns {object}
   */
  static get message() {
    return _message;
  }

  /**
   * @param {object} message
   */
  static set message(message) {
    _message = message;
  }

  static do(message, command, args, secure = true) {
    let method = Helper.dashToCamel(command);

    if (method === 'debug') {
      if (NO_DEBUG) return;

      command = args.shift();
      Commands.debug(message, command, args);
      return;
    }

    let user = message.author;
    Log.write(`[Command] from [${user.username} (${user.id})] ${method} ${args.join(' ')}`, true);

    if (typeof Commands[method] === 'function' && typeof CommandList[method] === 'function') {
      Commands[method](message, args);
      return;
    }

    if (ModuleManager.isCommand(method, secure)) {
      ModuleManager.do(method, message, args);
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

  static info(message, args) {
    message.channel.send(__('core_info'));
  }

  static debug(message, command, args) {
    if (message.author.username !== 'MisterMarlu') return;

    Commands.do(message, command, args, false);
  }

  static getCommands(message, args) {
    message.channel.send(ModuleManager.commandList());
  }
}

module.exports = Commands;

Helper.booted(__filename);