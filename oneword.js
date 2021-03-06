// Import the node modules
const Discord = require('discord.js');
let Twit = require('twit');

// Create an instance of a Discord and a Twitter client
const client = new Discord.Client();
let T = new Twit({
	consumer_key:         '',
	consumer_secret:      '',
	access_token:         '',
	access_token_secret:  ''
});

// The token of your bot - https://discordapp.com/developers/applications/me
const token = '';

// create bot prefix
const prefix = './';

// create other variables
let listening = false;
let returnStr = "";
let channel = null;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
    client.user.setActivity("./start"); // set game upon login
    console.log('ready to hear your story!');
});

// create an event listener for messages
client.on('message', message => {
    
    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if(message.author.bot) return;

    // Otherwise ignore any message that does not start with the prefix, 
    // which is set above
    if(message.content.indexOf(prefix) !== 0)
	{
		// if listening is true, add new words to your story
		if(listening === true && channel === message.channel)
		{
			if ((message.content.indexOf(".") == 0 || message.content.indexOf(",") ==  0 || message.content.indexOf("\"") == 0 || message.content.indexOf("?") == 0 || message.content.indexOf("!") == 0 || message.content.indexOf("™") == 0 || message.content.indexOf("“") == 0 || message.content.indexOf("”") == 0 || message.content.indexOf(";") == 0 || message.content.indexOf(":") == 0 || message.content.indexOf("(") == 0 || message.content.indexOf(")") == 0 || message.content.indexOf("[") == 0 || message.content.indexOf("]") == 0 || message.content.indexOf("~") == 0 || message.content.indexOf("-") == 0 || message.content.indexOf("/") == 0) && returnStr != "")
				returnStr = returnStr.slice(0, (returnStr.length - 1));
			
			returnStr += message.content + " ";
		}
		else return;
	}

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "start")
	{
		if(listening === true && channel === message.channel)
			return message.channel.send("Already listening on this channel! I'll make sure this word isn't logged. :wink:");
		else if (listening === true && channel != message.channel)
			return message.channel.send("Already listening on another channel!");
		
		listening = true;
		channel = message.channel;
		returnStr = "";
		return message.channel.send("Now listening! Type command `./end` to stop listening.\nRemember to end your sentences, close your quotes, write only one word at a time, and have fun!");
	}

	if (command === "end")
	{
		if(channel != message.channel)
			return message.channel.send("`./end` must be run from the same channel that `./start` was called from.");
		
		if (returnStr == "")
			return message.channel.send("You didn't write anything... But I'll keep listening!");
		
		listening = false;
		channel = null;
		
		if (returnStr.length <= 280)
		{
			T.post('statuses/update', { status: returnStr }, function(err,data,response) { if (err) throw err; });
		
			setTimeout(function()
			{
				T.get('statuses/user_timeline', { screen_name: 'TrueZetsubou' }, function(err, data, response)
				{
					if (err) throw err;

					message.channel.send("https://twitter.com/TrueZetsubou/status/" + data[0].id_str);
				});
			}, 3000);
		}
		
		else
			message.channel.send("Sorry, this one was too long for Twitter... But here's your final story:");
		
		return message.channel.send(returnStr);
	}
});

// log the bot in
client.login(token);
