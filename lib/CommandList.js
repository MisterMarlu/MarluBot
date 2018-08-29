const Helper = require('./Helper');

/**
 * Class CommandList is like an interface for commands. If any command is missing in this class you
 * cannot execute it.
 * In the methods of this class are just the descriptions for each method.
 */
class CommandList {
  static info() {
    return __('core_descInfo');
  }

  static debug() {
    return __('core_descDebug');
  }

  static version() {
    return __('core_descVersion');
  }

  static getCommands() {
    return __('core_descGetCommands');
  }
}

module.exports = CommandList;

Helper.booted(__filename);