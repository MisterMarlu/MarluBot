// Import modules.
const Discord = require('discord.js'),
  mysql = require('mysql'),

  // Import custom modules.
  DB = require('./lib/DB'),
  Commands = require('./lib/Commands'),
  ModuleManager = require('./lib/ModuleManager'),

  // Import configurations.
  databaseInformation = require('./database'),
  config = require('./config'),
  tokens = require('./tokens'),

  // Initiate bot.
  bot = new Discord.Client(),
  connection = mysql.createConnection(databaseInformation);

// Collect all modules.
ModuleManager.collectModules();

// Open connection.
connection.connect(error => {
  if (error) throw error;

  DB.setConnection(connection);

  // Executes when the bot is ready.
  bot.on('ready', async () => {
    await ModuleManager.mergeLocales();
    require('./lib/global');
    let Log = require('./lib/Log');
    Log.initLogger(NO_DEBUG ? 'log' : 'dev-log');
    Log.writeWithSpace('Bot woke up :)', true);
  });

  // Executes when a message was sent.
  bot.on('message', message => {
    // So the bot doesn't reply to itself.
    if (message.author.bot) return;
    if (NO_DEBUG && !config.release) {
      message.reply(__('core_notReleased'));
      return;
    }

    // Check if the message starts with the prefix trigger.
    if (message.content.indexOf(config.prefix) !== 0) return;

    // Get the user's message excluding the prefix.
    let text = message.content.substring(1),
      command = text.split(' ')[0],
      args = text.split(' ');

    args.shift();

    Commands.message = message;
    Commands.do(message, command, args);
  });

  // Also a bot have to be logged in.
  bot.login(tokens.discrodToken);
});