const Discord = require('discord.js'),
  mysql = require('mysql'),
  config = require('./config'),
  tokens = require('./tokens'),
  databaseCreds = require('./database'),
  {Commands} = require('./lib/Commands'),
  {MySQL} = require('./lib/MySQL'),
  bot = new Discord.Client(),
  db = new MySQL(),
  connection = mysql.createConnection(databaseCreds);

connection.connect(error => {
  if (error) throw error;

  db.setConnection(connection);

// Executes when the bot is ready.
  bot.on('ready', () => {
    console.log('Bot woke up :)');
    require('./lib/global');
  });

// Executes when a message was sent.
  bot.on('message', message => {
    // So the bot doesn't reply to itself.
    if (message.author.bot) return;

    // Check if the message starts with the prefix trigger.
    if (message.content.indexOf(config.prefix) !== 0) return;

    // Get the user's message excluding the prefix.
    let text = message.content.substring(1),
      command = text.split(' ')[0],
      args = text.split(' ');

    args.shift();

    Commands.do(message, command, args, bot);
  });

// Also a bot have to be logged in.
  bot.login(tokens.discrodToken);
});