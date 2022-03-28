const Discord = require("discord.js");
const { fstat } = require("fs");
const { connected } = require("process");
const client = new Discord.Client({ partials: ["MESSAGE", "USER", "REACTION"] });
const queue = new Map();
const prefix = "%";
const ytdl = require("ytdl-core");
const bdd = require("./bdd.json");
const fs = require("fs");
const weather = require("weather-js");
const ms = require('ms');
const moment = require("moment");
const { config, logo, hex_color, community_name, role_access_id, code_length, numbers_in_code, database_host, database_user, database_password, database_base } = require('./config.json');
client.commands = new Discord.Collection();

client.login("ODIzOTI1MTc0OTM5NTQ5Njk2.YFn6HQ.fQxuUofx0yg-LKt81rG-1SD81JI");

client.on('ready', async () => {
   console.log("Bot a démarré")

   let statuts = bdd.stats
   setInterval(function() {
      let stats = statuts[Math.floor(Math.random()*statuts.length)];
      client.user.setActivity(stats, {type: "WATCHING"})
   }, 3000)
   buttons : [{label : "Button1" , url : "Link1"},{label : "Button2",url : "Link2"}]

   client.user.setStatus("dnd");
})

client.on("guildCreate", guild => {
   bdd[guild.id] = {}
   Savebdd()
})


var mysql = require('mysql')

var con = mysql.createConnection({
    host: database_host,
    user: database_user,
    password: database_password,
    database: database_base
})
con.connect(function(err) {
  if (err) console.log (err);
  else
  console.log("MySQL connected!")
})

function createCode(code, type, amount) {
            var sql = "INSERT INTO codes (code, type, amount) VALUES('" + code + "', '" + type + "', '" + amount + "')";
            con.query(sql, function (result){
            if (result) { console.log(result) }
            console.log("Code créé !")
    });
}

function sendSuccsess(fromUser, toUser, code, type, amount, chnl, toUserUN) {

    const MadePrivateEmbed = new Discord.MessageEmbed()
	.setColor(hex_color)
    .setTitle('Vous avez reçu un code boutique !')
    .addFields(
		{ name: 'Code:', value: code},
        { name: 'Type:', value: 'Bitoin', inline: true },
        { name: 'Nombre:', value: amount, inline: true },
    { name: 'Utilisation:', value: '`/redeem <le code>`'},
  )
  .addField('Exemple :', 'Image :', true)
  .setImage('https://cdn.discordapp.com/attachments/824334274366013520/832771785749168178/unknown.png')
	.setAuthor(community_name + " Codes boutique", logo)
	.setTimestamp()
    toUser.send(MadePrivateEmbed);

    const MadeEmbed = new Discord.MessageEmbed()
	.setColor(hex_color)
    .setTitle('Nouveau code créé')
	.setDescription(fromUser + ' Code envoyé à : ' + toUserUN)
	.setAuthor(community_name + " Codes boutiques", logo)
	.setTimestamp()
    chnl.send(MadeEmbed);
}

function randomString() {
    var result = '';
    var length = code_length;
    if (numbers_in_code) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    else {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function sendusage(chnl) {
    const sendusage = new Discord.MessageEmbed()
	.setColor(hex_color)
  .setTitle('Utilisation des codes boutiques !')
  .addFields(
  { name: 'Creation de code (fonda seulement) :', value: '``%newcode <@user> money <amount>``'},
  { name: 'Utiliser le code IG', value: '`/redeem <le code>`'},
  )
	.setAuthor(community_name + " Codes boutiques", logo)
	.setTimestamp()
    chnl.send(sendusage);
}







client.on("message", async message => {
   if(message.author.bot) return;

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
      .setThumbnail(user.avatarURL)
      .setAuthor(`Information sur ${user.username}#${user.discriminator} :`,user.avatarURL)
      .addField('ID du compte:', `${user.id}`, true)
      .addField('Pseudo sur le serveur :', `${member.nickname ? member.nickname : 'Aucun'}`, true)
      .addField('A crée son compte le :', `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, false)
      .addField('A rejoint le serveur le :', `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, false)
      .addField('Rôles :', member.roles.cache.map(roles => `${roles.name}`).join(', '), false)
  message.channel.send(embed);
  }

  let member = message.mentions.users.first() || message.author

  let avatar = member.displayAvatarURL({size: 1024})

  if(message.content == prefix + "avatar"){
    message.channel.send(avatar);
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
         { name : 'RôlePlay :', value: '`codehelp` = **Aide à propos des codes boutique** \n`ano` = **Envoie un message anonyme dans le darknet**', inline: false },
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

  //commade redeem
  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command == "newcode") {
      message.delete()
      if (!message.member.roles.cache.has(role_access_id)) return;
      const toUser = message.mentions.members.first()
      const fromUser = message.author.username
      const toUserUN = message.mentions.users.first().username
      if (toUserUN == undefined)return sendusage(message.channel);
      if (args[1] == undefined)return sendusage(message.channel);
      const type = args[1].toLowerCase()
      const amount = parseInt(args[2])
      if (toUser == undefined) return sendusage(message.channel);
      if (type == undefined) return sendusage(message.channel);
      console.log(type)
      if (amount < 1) return sendusage(message.channel);
      var code = randomString();
      createCode(code, type, amount)
      sendSuccsess(fromUser, toUser, code, type, amount, message.channel, toUserUN)
  }
  if(command == "codehelp") {
      message.delete()
      if (!message.member.roles.cache.has(role_access_id)) return;
      sendusage(message.channel)
  }

  const uneCommande = '%ano '

  if (message.content.startsWith(uneCommande)) {
    message.delete()
    const str = message.content.substring(uneCommande.length)
    const anomsg = new Discord.MessageEmbed() 
    .setColor('#00000')
    .setAuthor('Message crypté')
    .setDescription(`**${str}**`)
    .setTimestamp()
    client.channels.cache.get("804707593897508914").send(anomsg);
    client.channels.cache.get("819392337355997194").send(message.author +  str);
  }

  //INFOCPU
  if(command == "cpu") {
    const si = require('systeminformation');
    si.cpu()
        .then(data => {
            console.log('Embed CPU envoyé');
            const cpuEmbed =  new Discord.MessageEmbed()
            .setColor("#82BCC1 ")
            .setAuthor('CPU Information 📜', message.author.displayAvatarURL, message.author.displayAvatarURL)
            .addFields(
                { name: 'CPU 🖥', value: `${data.manufacturer} ` + `${data.brand}`, inline: true },
                { name: 'Socket 🖥', value: data.socket, inline: true },
                { name: '\u200B', value: '\u200B' },
            )
            .addFields(
                { name: 'Vitesse du processeur 🖥', value: data.speed, inline: true },
                { name: 'Nombre de coeurs 🖥', value: data.physicalCores, inline: true },
                { name: 'Nombre de Threads 🖥', value: data.cores, inline: true },
            )
            .setTimestamp()
            .setFooter(message.author, message.author.displayAvatarURL);
            return message.channel.send(cpuEmbed);
        })
    }
 
  //giveway
  if(command == "gws") {
    message.delete()
    const patreonEmbed = new Discord.MessageEmbed()
      .setColor('FF0000')
      .setTitle('🎁・Pour lancer un giveaway :')
      .setURL('https://www.youtube.com/c/SOUKii')
      .setDescription('')
      .setThumbnail('https://media.discordapp.net/attachments/817191983562883103/824447043984031754/latest.png')
      .addFields(
        { name: '%start #chanel 250s 1 Cadeaux', value: 'Bon giveaway !' },
      )
      .setTimestamp()
    
      message.channel.send(patreonEmbed);
    }
  //startgiveway
  if(command == "start") {
    if(!message.member.hasPermission('MANAGE_MESSAGES')){
      return message.channel.send(':x: Vous devez avoir la permission suivante : `MANAGE_MESSAGES`.');
  }

  let giveawayChannel = message.mentions.channels.first();
  if(!giveawayChannel){
      return message.channel.send(':x: Vous devez mentionner un salon valide pour lancer le giveaway.');
  }

  let giveawayDuration = args[1];
  if(!giveawayDuration || isNaN(ms(giveawayDuration))){
      return message.channel.send(':x: Vous devez rentrer un temps valide !');
  }

  let giveawayNumberWinners = args[2];
  if(isNaN(giveawayNumberWinners)){
      return message.channel.send(':x: Vous devez mettre un nombre valide de gagnant(s) !');
  }

  let giveawayPrize = args.slice(3).join(' ');
  if(!giveawayPrize){
      return message.channel.send(':x: Vous devez mettre une récompense !');
  }
  client.giveawaysManager.start(giveawayChannel, {
      time: ms(giveawayDuration),
      prize: giveawayPrize,
      winnerCount: giveawayNumberWinners,
      messages: {
          giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
          giveawayEnded: "🎉🎉 **GIVEAWAY FINI** 🎉🎉",
          timeRemaining: "Temps restant : **{duration}**!",
          inviteToParticipate: "Réagis avec 🎉 pour rejoindre le giveaway !",
          winMessage: "Félicitations, {winners}! Tu as gagné : **{prize}**!",
          embedFooter: "Giveaway",
          noWinner: "Giveaway terminé, aucun participation valide donc, aucun gagnant.",
          winners: "gagnant(s)",
          endedAt: "Fini le",
          congrat: "Félicitations, {winners}! Tu as gagné : **{prize}**!",
          units: {
              seconds: "seconde",
              minutes: "minutes",
              hours: "heures",
              days: "jours",
              pluralS: true
          }
      }
  });

  message.channel.send(`Concours lancé dans le salon suivant : ${giveawayChannel}!`);

  }

  if(command == "end") {
      if(!message.member.hasPermission('MANAGE_MESSAGES')){
        return message.channel.send(':x: Vous devez avoir la permission suivante : `MANAGE_MESSAGES`.');
    }

    let messageID = args[0];
    if(!messageID){
        return message.channel.send(':x: Vous devez mettre un identifiant de message !');
    }

    try {
        client.giveawaysManager.edit(messageID, {
            setEndTimestamp: Date.now()
        });
        message.channel.send('Le giveaway va s\'éteindre dans '+(client.giveawaysManager.options.updateCountdownEvery/1000)+' secondes...');
    } catch (error) {
        if(error.startsWith(`Aucun giveaway trouvé avec l'identifiant suivant : ${messageID}.`)){
            message.channel.send('Je ne trouve pas de giveaway avec l\'identifiant suivant : '+messageID);
        }
        if(err.startsWith(`Le giveaway avec comme identifiant : ${messageID} est déjà fini.`)){
            message.channel.send('Le giveaway est déjà fini !');
        }
    }
        //reroll giveaways
        if(command == "reroll") {
        if(!message.member.hasPermission('MANAGE_MESSAGES')){
        return message.channel.send(':x: Vous devez avoir la permission suivante : `MANAGE_MESSAGES`.');
    }

    let messageID = args[0];
    if(!messageID){
        return message.channel.send(':x: Vous devez mettre un identifiant de message !');
    }

    try {
        client.giveawaysManager.reroll(messageID);
        message.channel.send('Giveaway relancé !');
    } catch (error) {
        if(error.startsWith(`Aucun giveaway trouvé avec l'identifiant suivant : ${messageID}.`)){
            message.channel.send('Je ne trouve aucun giveaway avec l\'idenfitiant suivant : '+messageID);
        }
        if(err.startsWith(`Le giveaway ayant comme identifiant : ${messageID} n'est pas encore fini.`)){
            message.channel.send('Ce giveaway n\'est pas fini !');
        }
    }

}


  if(command == "botinfo") {
    message.delete()
const botinfoEmbed = new Discord.MessageEmbed()
      .setColor('#00BDFF')
      .setTitle('📈・Information concernant le bot !')
      .setThumbnail('https://media.discordapp.net/attachments/817191983562883103/824447043984031754/latest.png')
      .addFields(
          { name: '\u200B', value: '\u200B' },
          { name: '✨ | Création :', value: '13/04/2021', inline: true },
          { name: '⌨ | Développeur :', value: '!Souki.#0303', inline: true },
      )
      .addField('Présence :', `${client.guilds.cache.size} serveurs`,  true)
      .setTimestamp()
  
  message.channel.send(botinfoEmbed);

}
};
    //meteo
    if(command == "meteo"){
    message.delete()

    weather.find({ search: args.join(" "), degreeType: "C" }, function (
        error,
        result
      ) {
          try {
          if (!result) {
            message.channel.send(
              "**S'il vous plaît, fournissez moi un emplacement valide.**"
            );
            return;
          }
          if (error) message.channel.send(error);
    
          const current = result[0].current;
          if (!current) return message.channel.send("**S'il vous plaît, fournissez moi un emplacement valide.**");
          let frTemps;
          switch (current.skytext) {
            case "Sunny":
              frTemps = "Ensoleillé";
              break;
            case "Clear":
              frTemps = "Clair";
              break;
            case "Mostly Clear":
              frTemps = "Globalement clair"
              break;
            case "Partly Clear":
              frTemps = "Partiellement clair"
              break;
            case "Mostly Sunny":
              frTemps = "Globalement ensoleillé";
              break;
            case "Cloudy":
              frTemps = "Nuageux";
              break;
            case "Mostly Cloudy":
              frTemps = "Globalement nuageux";
              break;
            case "Partly Cloudy":
              frTemps = "Partiellement nuageux";
              break;
            case "Partly Sunny":
              frTemps = "Partiellement ensoleillé";
              break;
            case "Blowing Dust":
              frTemps = "De la poussière dans l'air";
              break;
            case "Light Rain":
              frTemps = "Pluie légère";
              break;
            case "Haze":
              frTemps = "Brumeux";
              break;
            case "Smoke":
              frTemps = "De la fumée dans l'air";
              break;
            case "Fair": 
              frTemps = "Brumeux";
              break;
            case "Snow":
              frTemps = "Neige";
              break;
            case "Hail":
              frTemps = "Grêle";
              break;
            case "Rain Showers":
              frTemps = "Très pluvieux";
              break;
            case "Rain":
              frTemps = "Pluvieux";
              break;
            
          }
    
          let vitesse = current.winddisplay.substring(0, current.winddisplay.indexOf("h") + 1);
          let Dir;
          switch (current.winddisplay.substring(current.winddisplay.indexOf("h") + 2)) {
            case "Northeast":
              Dir = "Nord-Est";
              break;
            case "Southeast":
              Dir = "Sud-Est";
              break;
            case "Southwest":
              Dir = "Sud-Ouest";
              break;
            case "Northwest":
              Dir = "Nord-Ouest";
              break;
            case "North":
              Dir = "Nord";
              break;
            case "South":
              Dir = "Sud";
              break;
            case "East":
              Dir = "Est";
              break;
            case "West":
              Dir = "Ouest";
              break;
            default:
              Dir = "Aucun vent";
              break;
          }
    
          const météoEmbed = new Discord.MessageEmbed()
            .setDescription(`**${frTemps}**`)
            .setAuthor(`Météo pour ${current.observationpoint}`)
            .setThumbnail(current.imageUrl)
            .setColor(
              `${
                message.guild.me.displayHexColor !== "#00000"
                  ? message.guild.me.displayHexColor
                  : 0xffffff
              }`
            )
            .addField("Fuseau horaire", `UTC${result[0].location.timezone}`, true)
            .addField("Température", `${current.temperature} Degrés`, true)
            .addField("Ressenti", `${current.feelslike} Degrés`, true)
            .addField("Vitesse du vent :", vitesse, true)
            .addField("Direction du vent :", Dir, true)
            .addField("Humidité", `${current.humidity}%`, true);
          message.channel.send(météoEmbed);
        }catch {
          message.channel.send("**S'il vous plaît, fournissez moi un emplacement valide.**")
        }})

  
  
};

    if(command == "sondage") {
    message.delete()

        var sondage = args.slice(0).join(" ")

        if(!sondage) {const fail = await message.channel.send("Vous n'avez pas mentionner le sondage !"); wait(10000); fail.delete(); return}

        const embed = new Discord.MessageEmbed()
        .setColor('FF0000')
        .setAuthor("⚖️ Sondage")
        .addField('\u200B', `${sondage}`)
        .setFooter(`Proposer par ${message.author.tag}`, message.author.displayAvatarURL())
        message.channel.send(embed).then(embedMessage => {
            embedMessage.react("✅");
            embedMessage.react("❌");
        });
};



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

function wait(ms){
  var start = new Date().getTime()
  var end = start
  while(end < start + ms) {end = new Date().getTime();}
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