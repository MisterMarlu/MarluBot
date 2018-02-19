/**
 * Class CommandList is like an interface for commands. If any command is missing in this class you cannot execute it.
 * In the methods of this class are just the descriptions for each method.
 */
class CommandList {
  static test() {
    return __('descTest');
  }

  static getCommands() {
    return __('descGetCommands');
  }

  static lolElo() {
    return __('descLolElo');
  }

  static info() {
    return __('descInfo');
  }

  static debug() {
    return __('descDebug');
  }
}

exports.CommandList = CommandList;