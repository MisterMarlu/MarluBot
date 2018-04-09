const Helper = require('../../lib/Helper');

/**
 * Class CommandList is like an interface for commands. If any command is missing in this class you
 * cannot execute it.
 * In the methods of this class are just the descriptions for each method.
 */
class CommandList {
  static lolInfo() {
    return __('lol_descInfo');
  }

  // static lolElo() {
  //   return __('lol_descElo');
  // }
  //
  // static lolMatch() {
  //   return __('lol_descMatch');
  // }

  static lolVersion() {
    return __('lol_descVersion');
  }
}

module.exports = CommandList;

Helper.booted(__filename);