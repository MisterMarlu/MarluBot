/**
 * Class CommandList is like an interface for commands. If any command is missing in this class you cannot execute it.
 * In the methods of this class are just the descriptions for each method.
 */
class CommandList {
  static test() {
    return t('descTest');
  }

  static getCommands() {
    return t('descGetCommands');
  }

  static lolElo() {
    return t('descLolElo');
  }

  static info() {
    return t('descInfo');
  }

  static debug() {
    return t('descDebug');
  }
}

exports.CommandList = CommandList;