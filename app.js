const Discord = require('discord.js'),
  config = require('./config'),
  tokens = require('./tokens'),
  {Commands} = require('./lib/commands'),
  {getBotInfo} = require('./lib/info'),
  bot = new Discord.Client();

bot.on('ready', () => {
  console.log('Bot woke up :)');
});

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

bot.login(tokens.discrodToken);