// Load up the discord.js library
const Discord = require("discord.js");
var SourceQuery = require('sourcequery');

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();


// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
const ip_file = require("./ip.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});



client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  function queryserver(ip, port) {
    let sq = new SourceQuery(1000); // 1000ms timeout
    console.log(ip + "  " + port);
    sq.open(ip, port);
    sq.getInfo(function (err, info) {
      if (!err) {
        sq.getPlayers(function (err, players) {
          if (!err) {
            console.log(sq.address);
            //var msg = "#1 \n" + info.name + "\nServer IP : " + config.ip1 + ":" + config.port1 + "\nCurrent Map : " + info.map + "\nMax.Players : " + info.maxplayers + "\nCurrent Players : " + info.players + "\n\nFollowing Players are online\nPlayer Name\n";
            //console.log(msg);
            var counter = 0;
            playersname = "";
            for (i = 0; i < players.length; i++) {
              playersname = playersname + players[i].name + "\n";
              if (counter == players.length - 1) {
                console.log("Discord Message sent");
                message.channel.send({
                  embed: {
                    color: 3447003,
                    author: {
                      name: client.user.username,
                      icon_url: client.user.avatarURL
                    },
                    title: "Summer",
                    url: "http://google.com",
                    description: "Houdy hey, This is your Bot. Here is the status of server, I keep track off.",
                    fields: [{
                      name: "Server Name",
                      value: "**"+info.name+"**"
                    },
                    {
                      name: "Server IP",
                      value: "**connect "+ip+":"+port+"**",
                      "inline": true
                    },
                    {
                      name: "Current Map",
                      value: info.map,
                      "inline": true
                    },
                    {
                      name: "Max.Players",
                      value: info.maxplayers,
                      "inline": true
                    },
                    {
                      name: "Current Players",
                      value: info.players,
                      "inline": true
                    },
                    {
                      name: "Following Players are online",
                      value: playersname
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                      icon_url: client.user.avatarURL,
                      text: "© Summer"
                    }
                  }
                });
              }
              counter++;
            }
          }
          else {
            console.log("Error in Players query");
            message.channel.send("Error in Players query");
          }
        });
      }
      else {
        console.log("Error in info query");
        message.channel.send("Error in info query");
      }
    });
  }

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ ss/g);
  var arguments = args.shift().toLowerCase();
  arguments = arguments.split(" ");
  const command = arguments[0];
  console.log(arguments);
  console.log(command);

  // Let's go with a few common example commands! Feel free to delete or change those.

  if (command == "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if (command == "help") {
    const m = await message.channel.send("Okie :)");
    m.edit("You can use following Commands\n-> +ping (It will give ping details)\n-> +status <server ip> <server port> (it will give you live status of any csgo server)\n-> +statusall (It will give you status of all csgo servers of the Owner\n\n + is prefix it is required for every command");
  }

  if (command == "statusall") {
    ip_file.IP.forEach((value, key) => {
      console.log(ip_file.IP[key].ip + "  " + ip_file.IP[key].port);
      queryserver(ip_file.IP[key].ip, ip_file.IP[key].port);
    })
  }

  if (command == "status") {
    console.log(arguments[1] + "  " + arguments[2]);
    queryserver(arguments[1], arguments[2]);
  }

});

client.login(config.token);
