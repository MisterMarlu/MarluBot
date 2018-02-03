const Discord = require('discord.js'),
  config = require('./config'),
  tokens = require('./tokens'),
  {Commands} = require('./lib/commands'),
  bot = new Discord.Client();

bot.on('ready', () => {
  console.log('Bot woke up :)');
});

bot.on('message', message => {
  // So the bot doesn't reply to iteself
  if (message.author.bot) return;

  // Check if the message starts with the `!` trigger
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Get the user's message excluding the `!`
  let text = message.content.substring(1),
    command = text.split(' ')[0],
    args = text.split(' ');

  args.shift();

  Commands.do(message, command, args);
});

bot.login(tokens.discrodToken);