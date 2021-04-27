var port = process.env.PORT || 8080;
const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.js');
const client = new Discord.Client({ fetchAllMembers: true });
const { GiveawaysManager } = require("discord-giveaways");
const db = require("quick.db");
const DisTube = require('distube');
const GuildOptions = require('./models/GuildOptions.js');
const map = new Map();

// MUSIQUES
client.distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: true });
const status = (queue) => `Volume: \`${queue.volume}%\` | Filtre: \`${queue.filter || "Désactivé"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "Toute la File" : "Cette Musique" : "Désactivé"}\` | Autoplay: \`${queue.autoplay ? "Activé" : "Désactivé"}\``;
client.distube
    .on("playSong", (message, queue, song) => message.channel.send(new Discord.MessageEmbed()
        .setDescription(`<:icone_verified:824290381435895818> | Musique en cours de lecture : \`${song.name}\` - \`${song.formattedDuration}\`\nDemandée par : ${song.user}\n${status(queue)}`)
        .setColor('14b321')
    ))
    .on("addSong", (message, queue, song) => message.channel.send(new Discord.MessageEmbed()
        .setDescription(`<:icone_rejoint:824290384250667079> | La musique \`${song.name}\` - \`${song.formattedDuration}\` a correctement été ajoutée à la liste de lecture par ${song.user}`)
        .setColor('14b321')
    ))
    .on("playList", (message, queue, playlist, song) => message.channel.send(new Discord.MessageEmbed()
        .setDescription(`<:icone_rejoint:824290384250667079> | Lecture de la playlist \`${playlist.name}\` (${playlist.songs.length} musiques).\nDemandée par : ${song.user}\nEn cours de lecture \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`)
        .setColor('14b321')
    ))
    .on("addList", (message, queue, playlist) => message.channel.send(new Discord.MessageEmbed()
        .setDescription(`<:icone_annonces:824290381029965834> | Playlist \`${playlist.name}\` ajoutée (${playlist.songs.length} musiques) dans la file\n${status(queue)}`)
        .setColor('14b321')
    ))
    .on("empty", message => message.channel.send(new Discord.MessageEmbed()
        .setDescription("<:icone_disconnect:824290384065593345> | J'ai quitté le salon vocal car celui-ci était vide.")
        .setColor('d10000')
    ))
    .on("finish", message => message.channel.send(new Discord.MessageEmbed()
        .setDescription("<:icone_indisponible:824290381222117396> | Plus aucune musique dans la file d'attente.")
        .setColor('d10000')
    ));

// GIVEAWAYS
if (!db.get("giveaways")) db.set("giveaways", []);

const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    async getAllGiveaways() {
        return db.get("giveaways");
    }

    async saveGiveaway(messageID, giveawayData) {
        db.push("giveaways", giveawayData);
    }

    async editGiveaway(messageID, giveawayData) {
        const giveaways = db.get("giveaways");
        const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
        newGiveawaysArray.push(giveawayData);
        db.set("giveaways", newGiveawaysArray);
    }

    async deleteGiveaway(messageID) {
        const newGiveawaysArray = db.get("giveaways").filter((giveaway) => giveaway.messageID !== messageID);
        db.set("giveaways", newGiveawaysArray);
    }

};

const manager = new GiveawayManagerWithOwnDatabase(client, {
    storage: false,
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        exemptPermissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
        embedColor: '14b321',
        reaction: '🎉'
    }
});

client.giveawaysManager = manager;

// SNIPES
client.snipes = new Map();

// COOLDOWNS
client.cooldowns = new Discord.Collection();

// COMMANDES
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

// EVENTS
const eventFolders = fs.readdirSync('./events');

for (const folder of eventFolders) {
    const eventFiles = fs.readdirSync(`./events/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const events = require(`./events/${folder}/${file}`);
        const event = file.split('.')[0];

        client.on(event, events.bind(null, client));
    }
}

client.on('message', async (message) => {
    GuildOptions.findOne({
        guildID: message.guild.id
    }, async (err, data) => {
        if (err) console.log(err);
        if (!data) {
            const newData = new GuildOptions({
                name: message.guild.name,
                guildID: message.guild.id,
                prefix: '$',
                AntiLink: false,
                AntiSpam: false,
                AntiInsults: false
            })
            newData.save().catch(err => console.log(err));

            const prefix = '$';
            const AntiLink = false;
            const AntiSpam = false;
            const AntiInsults = false;

            // ANTI INSULTS
            if (AntiInsults === true) {
                let blacklisted = ['fdp', 'pd', 'ntm', 'sale merde', 'salope', 'pute', 'connard', 'bâtard', 'tg', 'ta gueule', 'sale juif', 'nique ta mère', 'nike ta mère', 'enculé', 'enculer', 'va te faire foutre', 'chien de la casse', 'hitler', 'vivitler'];
                let foundInText = false;

                for (var i in blacklisted) {
                    if (message.content.toLocaleLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
                }
                if (foundInText) {
                    message.delete();
                    message.reply('<:icone_indisponible:824290381222117396> : évite d\'utiliser ce genre de langage !').then(sent => sent.delete({ timeout: 5e3 }));
                }
            } else return;

            // ANTI SPAM
            if (AntiSpam === true) {
                if (map.has(message.author.id)) {
                    const data = map.get(message.author.id);
                    const { lastmsg, timer } = data;
                    const diff = message.createdTimestamp - lastmsg.createdTimestamp;
                    let msgs = data.msgs;
                    const authorPerms = message.channel.permissionsFor(message.author);
                    if (authorPerms.has('MANAGE_MESSAGES')) return;
                    if (diff > 2000) {
                        clearTimeout(timer);
                        data.msgs = 1;
                        data.lastmsg = message;
                        data.timer = setTimeout(() => {
                            map.delete(message.author.id);
                        }, 5000);
                        map.set(message.author.id, data);
                    } else {
                        ++msgs;
                        if (parseInt(msgs) === 6) {
                            const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === "muted");
                            if (!role) {
                                try {
                                    let muterole = await message.guild.roles.create({
                                        data: {
                                            name: 'muted',
                                            permissions: []
                                        }
                                    });

                                    message.guild.channels.cache.filter(c => c.type === 'text').forEach(async (channel, id) => {
                                        await channel.createOverwrite(muterole, {
                                            SEND_MESSAGES: false,
                                            ADD_REACTIONS: false
                                        });
                                    });

                                } catch (error) {
                                    console.log(error);
                                }

                                const role2 = message.guild.roles.cache.find(role => role.name.toLowerCase() === "muted");

                                message.member.roles.add(role2);
                                message.channel.send(new Discord.MessageEmbed()
                                    .setColor('14b321')
                                    .setDescription(`L'utilisateur ${message.author} (\`${message.author.username}#${message.author.discriminator}\`) a été mute pour spam pendant __**30 min**__.`)
                                );
                                const embed = new Discord.MessageEmbed()
                                    .setDescription(`Vous avez été mute dans le serveur __**${message.guild.name}**__ pour __**spam**__ pendant __**30 min**__.`)
                                    .setColor("d10000")

                                message.author.send(embed).catch(console.error);
                                setTimeout(() => {
                                    const embed1 = new Discord.MessageEmbed()
                                        .setDescription(`Vous avez été unmute dans le serveur __**${message.guild.name}**__.`)
                                        .setColor("14b321")

                                    message.author.send(embed1).catch(console.error);
                                    message.member.roles.remove(role);
                                    message.channel.send(new Discord.MessageEmbed()
                                        .setColor('14b321')
                                        .setDescription(`L'utilisateur ${message.author} (\`${message.author.username}#${message.author.discriminator}\`) a été unmute.`)
                                    );
                                }, 1800 * 1000);
                            }
                            else {
                                message.member.roles.add(role);
                                message.channel.send(new Discord.MessageEmbed()
                                    .setColor('14b321')
                                    .setDescription(`L'utilisateur ${message.author} (\`${message.author.username}#${message.author.discriminator}\`) a été mute pour spam pendant __**30 min**__.`)
                                );
                                const embed = new Discord.MessageEmbed()
                                    .setDescription(`Vous avez été mute dans le serveur __**${message.guild.name}**__ pour __**spam**__ pendant __**30 min**__.`)
                                    .setColor("d10000")

                                message.author.send(embed).catch(console.error);
                                setTimeout(() => {
                                    const embed1 = new Discord.MessageEmbed()
                                        .setDescription(`Vous avez été unmute dans le serveur __**${message.guild.name}**__.`)
                                        .setColor("14b321")

                                    message.author.send(embed1).catch(console.error);
                                    message.member.roles.remove(role);
                                    message.channel.send(new Discord.MessageEmbed()
                                        .setColor('14b321')
                                        .setDescription(`L'utilisateur ${message.author} (\`${message.author.username}#${message.author.discriminator}\`) a été unmute.`)
                                    );
                                }, 1800 * 1000);
                            }
                        } else {
                            data.msgs = msgs;
                            map.set(message.author.id, data);
                        }
                    }
                } else {
                    let remove = setTimeout(() => {
                        map.delete(message.author.id);
                    }, 5000);
                    map.set(message.author.id, {
                        msgs: 1,
                        lastmsg: message,
                        timer: remove
                    });
                }
            } else return;

            // ANTI LINK
            if (AntiLink === true) {
                const isInvite = async (guild, code) => {
                    return await new Promise(resolve => {
                        guild.fetchInvites().then((invites) => {
                            for (const invite of invites) {
                                if (code === invite[0]) {
                                    resolve(true);
                                    return;
                                }
                            }
                            resolve(false);
                        });
                    });
                }

                const code = message.content.split('discord.gg/')[1];

                if (message.content.includes('discord.gg/')) {
                    const isOurInvite = await isInvite(message.guild, code);

                    if (!isOurInvite) {
                        message.delete();
                        message.reply('<:icone_indisponible:824290381222117396> : il est interdit de faire de la publicité sur ce serveur.').then(sent => sent.delete({ timeout: 5e3 }));
                    }
                }
            } else return;
        }
        else if (data) {
            const prefix = data.prefix;
            const AntiLink = data.AntiLink;
            const AntiSpam = data.AntiSpam;
            const AntiInsults = data.AntiInsults;

            // ANTI INSULTS
            if (AntiInsults === true) {
                let blacklisted = ['fdp', 'pd', 'ntm', 'sale merde', 'salope', 'pute', 'connard', 'bâtard', 'tg', 'ta gueule', 'sale juif', 'nique ta mère', 'nike ta mère', 'enculé', 'enculer', 'va te faire foutre', 'chien de la casse', 'hitler', 'vivitler'];
                let foundInText = false;

                for (var i in blacklisted) {
                    if (message.content.toLocaleLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
                }
                if (foundInText) {
                    message.delete();
                    message.reply('<:icone_indisponible:824290381222117396> : évite d\'utiliser ce genre de langage !').then(sent => sent.delete({ timeout: 5e3 }));
                }
            }

            // ANTI SPAM
            if (AntiSpam === true) {
                if (map.has(message.author.id)) {
                    const data = map.get(message.author.id);
                    const { lastmsg, timer } = data;
                    const diff = message.createdTimestamp - lastmsg.createdTimestamp;
                    let msgs = data.msgs;
                    const authorPerms = message.channel.permissionsFor(message.author);
                    if (authorPerms.has('MANAGE_MESSAGES')) return;
                    if (diff > 2000) {
                        clearTimeout(timer);
                        data.msgs = 1;
                        data.lastmsg = message;
                        data.timer = setTimeout(() => {
                            map.delete(message.author.id);
                        }, 5000);
                        map.set(message.author.id, data);
                    } else {
                        ++msgs;
                        if (parseInt(msgs) === 6) {
                            const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === "muted");
                            if (!role) {
                                try {
                                    let muterole = await message.guild.roles.create({
                                        data: {
                                            name: 'muted',
                                            permissions: []
                                        }
                                    });

                                    message.guild.channels.cache.filter(c => c.type === 'text').forEach(async (channel, id) => {
                                        await channel.createOverwrite(muterole, {
                                            SEND_MESSAGES: false,
                                            ADD_REACTIONS: false
                                        });
                                    });

                                } catch (error) {
                                    console.log(error);
                                }

                                const role2 = message.guild.roles.cache.find(role => role.name.toLowerCase() === "muted");

                                message.member.roles.add(role2);
                                message.channel.send(new Discord.MessageEmbed()
                                    .setColor('14b321')
                                    .setDescription(`L'utilisateur ${message.author} (\`${message.author.username}#${message.author.discriminator}\`) a été mute pour spam pendant __**30 min**__.`)
                                );
                                const embed = new Discord.MessageEmbed()
                                    .setDescription(`Vous avez été mute dans le serveur __**${message.guild.name}**__ pour __**spam**__ pendant __**30 min**__.`)
                                    .setColor("d10000")

                                message.author.send(embed).catch(console.error);
                                setTimeout(() => {
                                    const embed1 = new Discord.MessageEmbed()
                                        .setDescription(`Vous avez été unmute dans le serveur __**${message.guild.name}**__.`)
                                        .setColor("14b321")

                                    message.author.send(embed1).catch(console.error);
                                    message.member.roles.remove(role);
                                    message.channel.send(new Discord.MessageEmbed()
                                        .setColor('14b321')
                                        .setDescription(`L'utilisateur ${message.author} (\`${message.author.username}#${message.author.discriminator}\`) a été unmute.`)
                                    );
                                }, 1800 * 1000);
                            }
                            else {
                                message.member.roles.add(role);
                                message.channel.send(new Discord.MessageEmbed()
                                    .setColor('14b321')
                                    .setDescription(`L'utilisateur ${message.author} (\`${message.author.username}#${message.author.discriminator}\`) a été mute pour spam pendant __**30 min**__.`)
                                );
                                const embed = new Discord.MessageEmbed()
                                    .setDescription(`Vous avez été mute dans le serveur __**${message.guild.name}**__ pour __**spam**__ pendant __**30 min**__.`)
                                    .setColor("d10000")

                                message.author.send(embed).catch(console.error);
                                setTimeout(() => {
                                    const embed1 = new Discord.MessageEmbed()
                                        .setDescription(`Vous avez été unmute dans le serveur __**${message.guild.name}**__.`)
                                        .setColor("14b321")

                                    message.author.send(embed1).catch(console.error);
                                    message.member.roles.remove(role);
                                    message.channel.send(new Discord.MessageEmbed()
                                        .setColor('14b321')
                                        .setDescription(`L'utilisateur ${message.author} (\`${message.author.username}#${message.author.discriminator}\`) a été unmute.`)
                                    );
                                }, 1800 * 1000);
                            }
                        } else {
                            data.msgs = msgs;
                            map.set(message.author.id, data);
                        }
                    }
                } else {
                    let remove = setTimeout(() => {
                        map.delete(message.author.id);
                    }, 5000);
                    map.set(message.author.id, {
                        msgs: 1,
                        lastmsg: message,
                        timer: remove
                    });
                }
            }

            // ANTI LINK
            if (AntiLink === true) {
                const isInvite = async (guild, code) => {
                    return await new Promise(resolve => {
                        guild.fetchInvites().then((invites) => {
                            for (const invite of invites) {
                                if (code === invite[0]) {
                                    resolve(true);
                                    return;
                                }
                            }
                            resolve(false);
                        });
                    });
                }

                const code = message.content.split('discord.gg/')[1];

                if (message.content.includes('discord.gg/')) {
                    const isOurInvite = await isInvite(message.guild, code);

                    if (!isOurInvite) {
                        message.delete();
                        message.reply('<:icone_indisponible:824290381222117396> : il est interdit de faire de la publicité sur ce serveur.').then(sent => sent.delete({ timeout: 5e3 }));
                    }
                }
            }
        }
        else {
            console.log(err);
        }
    });
});

client.login(config.TOKEN);