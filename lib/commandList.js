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
}

exports.CommandList = CommandList;