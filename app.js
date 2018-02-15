if (typeof NO_DEBUG === 'undefined') {
  /**
   * Define DEBUG for debugging.
   */
  Object.defineProperty(global, 'NO_DEBUG', {
    get: function () {
      let noDebug = false;

      for (let i = 0; i < process.argv.length; i += 1) {
        if (process.argv[i] === 'noDebug') noDebug = true;
      }

      return noDebug;
    }
  });
}

const Discord = require('discord.js'),
  config = require('./config'),
  tokens = require('./tokens'),
  {Commands} = require('./lib/commands'),
  {getBotInfo} = require('./lib/info'),
  bot = new Discord.Client();

// Executes when the bot is ready.
bot.on('ready', () => {
  console.log('Bot woke up :)');
});

// Executes when a message was sent.
bot.on('message', message => {
  // So the bot doesn't reply to iteself
  if (message.author.bot) return;

  let mentionedUsers = message.mentions.users.array();
  for (let i = 0; i < mentionedUsers.length; i += 1) {
    let user = mentionedUsers[i];
    if (user.username === bot.user.username && user.bot) {
      // message.reply(getBotInfo(bot));
      // return;
    }
  }

  // Check if the message starts with the prefix trigger
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Get the user's message excluding the `!`
  let text = message.content.substring(1),
    command = text.split(' ')[0],
    args = text.split(' ');

  args.shift();

  Commands.do(message, command, args, bot);
});

// Also a bot have to be logged in.
bot.login(tokens.discrodToken);