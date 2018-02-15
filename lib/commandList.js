/**
 * Class CommandList is like an interface for commands. If any command is missing in this class you cannot execute it.
 * In the methods of this class are just the descriptions for each method.
 */
class CommandList {
  static test() {
    return 'Test if the bot is awake.';
  }

  static getCommands() {
    return 'Get a list of all commands with it\'s description.';
  }

  static lolElo() {
    return 'Get the current rank information of a summoner. Argument one must be the summoner name.';
  }

  static info() {
    return 'Get the current information of this bot.';
  }

  static debug() {
    return 'Just for development.';
  }
}

exports.CommandList = CommandList;