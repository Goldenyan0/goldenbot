const Discord = require("discord.js");
const { fstat } = require("fs");
const { connected } = require("process");
const client = new Discord.Client;
const queue = new Map();
const prefix = "%";
const ytdl = require("ytdl-core");
const bdd = require("./bdd.json");
const fs = require("fs");
const moment = require("moment");

client.login("NzgwMjM5NjQ4NzQzODgyNzYy.X7sMzA.DYte4xlKraZEHASElzoJAEfNDI8");

client.on('ready', async () => {
   console.log("Bot a démarré")

   let statuts = bdd.stats
   setInterval(function() {
      let stats = statuts[Math.floor(Math.random()*statuts.length)];
      client.user.setActivity(stats, {type: "WATCHING"})
   }, 3000)

   client.user.setStatus("dnd");
})

client.on("guildCreate", guild => {
   bdd[guild.id] = {}
   Savebdd()
})


client.on("message", async message => {
   if(message.author.bot) return;
   if(message.channel.type == "dm") return;

   let messagess = bdd.mess
   let mess = messagess[Math.floor(Math.random()*messagess.length)];
   let messagess2 = bdd.nitros
   let nitros = messagess2[Math.floor(Math.random()*messagess2.length)];

   const serverQueue = queue.get(message.guild.id);

   if (message.content.startsWith("%info")) {
      if(message.mentions.users.first()) {
          user = message.mentions.users.first();
     } else{
          user = message.author;
      }
      const member = message.guild.member(user);
      const embed = new Discord.MessageEmbed() 
      .setColor('#FFFF00')
      .setTitle(`Information sur ${user.username}#${user.discriminator} :`)
      .addField('ID du compte:', `${user.id}`, true)
      .addField('Pseudo sur le serveur :', `${member.nickname ? member.nickname : 'Aucun'}`, true)
      .addField('A crée son compte le :', `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, false)
      .addField('A rejoint le serveur le :', `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, false)
      .addField('Rôles :', member.roles.cache.map(roles => `${roles.name}`).join(', '), false)
  message.channel.send(embed);
  }

   if(message.content == prefix + "nitro"){
      message.channel.send(nitros);
   }

   if(message.content == prefix + "meme"){
      message.channel.send(mess);
   }

   if (message.content.startsWith(`%play`)) {
     execute(message, serverQueue);
     return;
   } else if (message.content.startsWith(`%skip`)) {
     skip(message, serverQueue);
     return;
   } else if (message.content.startsWith(`%stop`)) {
     stop(message, serverQueue);
     return;
   }

   var embed = new Discord.MessageEmbed()
      .setColor("#FFFF00")
      .setTitle("Aide au commandes")
      .setAuthor("Golden BOT", "https://media.discordapp.net/attachments/817191983562883103/824447043984031754/latest.png", "https://discord.gg/YS7neWJAwz")
      .setThumbnail("https://media.discordapp.net/attachments/817191983562883103/824447043984031754/latest.png")
      .setFooter("By Goldenyan#5476 ✔️")
      .addFields(
         { name : 'Commandes Staff :', value: '`ban (membre)` \n`kick (membre)` \n`clear (nombre de messages)` ', inline: false },
         { name : 'Commandes Statistiques :', value: '`info (membre)` = statistiques du membre mentionné \n`stats` = statistiques du serveur ' , inline: false },
         { name : 'Commandes Musique :', value: '`play (url)` = **jouer une musique youtube** \n`skip` **= passer la musique** \n`stop` = **déconnecter le bot**',   inline: false },
         { name : 'Commandes Funs :', value: '`nitro` = **vous génère un nitro** \n`meme` = **vous envoie une vidéo drôle**', inline: false },
      )
      
   if(message.content == prefix + "help"){
      message.channel.send(embed);
   }

   if(message.member.permissions.has('MANAGE_MESSAGES')){
      if(message.content.startsWith(prefix + "clear")){
         let args = message.content.split(" ");
         
         if(args[1] == undefined ){
            message.reply("Nombre de messages non défini");
         }
         else {
            let number = parseInt(args[1]);

            if(isNaN(number)){
               message.reply("Nombre de message non défini");
            }
            else {
               message.channel.bulkDelete(number).then(messages => {
                  console.log("Suppression de " + messages.size + " messages réussie");
               }).catch(err => {
                  console.log("Erreur de clear : " + err);
               });
            }
         }
      }

   }

    // commande de stats
    if (message.content.startsWith(`%stats`)) {
      let onlines = message.guild.members.cache.filter(({
          presence
      }) => presence.status !== 'offline').size;
      let totalmembers = message.guild.members.cache.size;
      let totalservers = client.guilds.cache.size;
      let totalbots = message.guild.members.cache.filter(member => member.user.bot).size;

      const EmbedStats = new Discord.MessageEmbed()
          .setColor('#FFFF00')
          .setTitle('Statistiques du serveur ')
          .setAuthor('Golden Bot', 'https://media.discordapp.net/attachments/817191983562883103/824447043984031754/latest.png', 'https://discord.js.org')
          .setThumbnail('https://media.discordapp.net/attachments/817191983562883103/824447043984031754/latest.png')
          .addFields({
              name: 'Nombre de membres total',
              value: totalmembers,
              inline: false
          }, {
              name: 'Membres connéctés : ',
              value: onlines,
              inline: false
          }, {
              name: 'Nombre de serveurs du bot : ',
              value: totalservers,
              inline: false
          }, {
              name: 'Nombres de bots sur le serveur : ',
              value: totalbots,
              inline: true
          },);

      message.channel.send(EmbedStats);
  }

});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "Tu dois être dans un salon vocal!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "Je n'ai pas les permissions pour rejoindre !"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} à été ajouté à la queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Tu dois être dans un salon vocal !"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Tu dois être dans un salon vocal !"
    );
    
  if (!serverQueue)
    return message.channel.send("Il n'y a aucune musique à stopper baka!");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Joue actuellement : **${song.title}**`);
}

function Savebdd() {
   fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
      if (err) message.channel.send("Une erreur est apparue")
   })
}