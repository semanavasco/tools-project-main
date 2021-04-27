const Discord = require('discord.js');
const GuildLogs = require('../models/GuildLogs.js');
const GuildWelcome = require('../models/GuildWelcome.js');
const moment = require('moment');
const { CanvasSenpai } = require("canvas-senpai")
const canvasenpai = new CanvasSenpai();

module.exports = async (client) => {
    client.on('guildMemberAdd', async (member) => {

        // LOGS
        GuildLogs.findOne({
            guildID: member.guild.id
        }, async (err, data) => {
            if (err) console.log(err);
            let logsChannel = '';
            let guildLogs = false;
            let userinfo = {};
            userinfo.avatar = member.user.displayAvatarURL({ format: 'png', dynamic: true });
            userinfo.name = member.user.username;
            userinfo.discrim = `#${member.user.discriminator}`;
            userinfo.id = member.user.id;

            if (!data) {
                const newData = new GuildLogs({
                    name: member.guild.name,
                    guildID: member.guild.id,
                    logsChannel: '',
                    guildLogs: false,
                    userLogs: false
                });
                newData.save().catch(err => console.log(err));

                logsChannel = '';
            }
            else {
                logsChannel = data.logsChannel;
                guildLogs = data.guildLogs;
            }

            if (!logsChannel || logsChannel === '') return;

            let embed = new Discord.MessageEmbed()
                .setTitle(`<:icone_rejoint:824290384250667079> | Nouveau Membre !`)
                .setDescription(`L'utilisateur **<@${member.user.id}> (\`${member.user.id}\`)** a rejoint le serveur !`)
                .setColor('14b321')
                .setTimestamp()
                .setFooter(member.user.username, member.user.displayAvatarURL({ format: "png", dynamic: true }))
                .addField(`<:icone_dmd:824290383965585410> - Nom d'Utilisateur`, userinfo.name, true)
                .addField(`<:icone_role:824290384204660806> - Tag de l'Utilisateur`, userinfo.discrim, true)
                .addField(`<:icone_carte:824290384506257438> - ID de l'Utilisateur`, userinfo.id, true)
                .addField(`<:badge_staff:824290372758274058> - Compte Créé`, `${moment(member.user.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`, true)

            let chan = member.guild.channels.cache.get(logsChannel);
            if (!chan) return;
            if (guildLogs === false) return;
            chan.send(embed);
        });

        // MESSAGE BIENVENUE
        GuildWelcome.findOne({
            guildID: member.guild.id
        }, async (err, data) => {
            if (err) console.log(err);
            let channel = '';

            if (!data) {
                const newData = new GuildWelcome({
                    name: member.guild.name,
                    guildID: member.guild.id,
                    onoff: false,
                    channel: '',
                    embed: {
                        activate: false,
                        title: '',
                        thumbnail: '',
                        description: '',
                        color: '',
                        date: false,
                        image: '',
                        footer: ''
                    },
                    image: {
                        activate: false,
                        image: ''
                    },
                    texte: ''
                });

                channel = '';

                newData.save().catch(err => console.log(err));
            }

            else {
                channel = data.channel;

                if (!channel || channel === '') return;

                const chan = member.guild.channels.cache.get(channel);
                if (!chan) return;

                if (data.onoff === false) return;
                else {
                    // EMBED
                    if (data.embed.activate === true) {
                        const embed = new Discord.MessageEmbed()

                        if (data.embed.title && data.embed.title !== '') {
                            embed.setTitle(data.embed.title);
                        }
                        if (data.embed.thumbnail && data.embed.thumbnail !== '') {
                            embed.setThumbnail(data.embed.thumbnail);
                        }
                        if (data.embed.description && data.embed.description !== '') {
                            let texte = '';

                            texte = data.embed.description;

                            if (!texte && texte === '') {
                                texte = `Bienvenue à toi <@${member.user.id}>, j'espère que tu t'amuseras dans notre serveur **${member.guild.name}** ! Tu es notre **${member.guild.memberCount}e** membre.`;

                                embed.setDescription(texte);
                            } else {
                                const mess1 = texte.replace(`{userMention}`, `<@${member.user.id}>`);
                                const mess2 = mess1.replace(`{userName}`, `${member.user.username}`);
                                const mess3 = mess2.replace(`{server}`, `${member.guild.name}`);
                                const messageAEnvoyer = mess3.replace(`{memberCount}`, `${member.guild.memberCount}`);

                                embed.setDescription(messageAEnvoyer);
                            }
                        }
                        if (data.embed.date === true) {
                            embed.setTimestamp();
                        }
                        if (data.embed.image && data.embed.image !== '') {
                            embed.setImage(data.embed.image);
                        }
                        if (data.embed.footer && data.embed.footer !== '') {
                            embed.setFooter(data.embed.footer, member.user.displayAvatarURL({ format: "png", dynamice: true }));
                        }

                        // IMAGE
                        if (data.image.activate === true) {
                            let link = `https://media.discordapp.net/attachments/836162763902418956/836163124570750996/43-431674_5cm-per-second-wallpaper-hd.jpeg`;

                            if (!data.image.image || data.image.image === '') {
                                link = `https://media.discordapp.net/attachments/836162763902418956/836163124570750996/43-431674_5cm-per-second-wallpaper-hd.jpeg`;
                            } else link = data.image.image;

                            let imageData = await canvasenpai.welcome(member, { link: link });

                            const attachment = new Discord.MessageAttachment(
                                imageData,
                                `welcome-${member.user.id}.png`
                            );

                            chan.send(embed, attachment);
                        } else chan.send(embed);

                    }
                    // TEXTE NORMAL
                    else {
                        let texte = '';

                        texte = data.texte;

                        if (!texte || texte === '') {
                            texte = `Bienvenue à toi <@${member.user.id}>, j'espère que tu t'amuseras dans notre serveur **${member.guild.name}** ! Tu es notre **${member.guild.memberCount}e** membre.`;

                            // IMAGE
                            if (data.image.activate === true) {
                                let link = `https://media.discordapp.net/attachments/836162763902418956/836163124570750996/43-431674_5cm-per-second-wallpaper-hd.jpeg`;

                                if (!data.image.image || data.image.image === '') {
                                    link = `https://media.discordapp.net/attachments/836162763902418956/836163124570750996/43-431674_5cm-per-second-wallpaper-hd.jpeg`;
                                } else link = data.image.image;

                                let imageData = await canvasenpai.welcome(member, { link: link });

                                const attachment = new Discord.MessageAttachment(
                                    imageData,
                                    `welcome-${member.user.id}.png`
                                );

                                chan.send(texte, attachment);
                            } else chan.send(texte);
                        } else {
                            const mess1 = texte.replace(`{userMention}`, `<@${member.user.id}>`);
                            const mess2 = mess1.replace(`{userName}`, `${member.user.username}`);
                            const mess3 = mess2.replace(`{server}`, `${member.guild.name}`);
                            const messageAEnvoyer = mess3.replace(`{memberCount}`, `${member.guild.memberCount}`);

                            // IMAGE
                            if (data.image.activate === true) {
                                let link = `https://media.discordapp.net/attachments/836162763902418956/836163124570750996/43-431674_5cm-per-second-wallpaper-hd.jpeg`;

                                if (!data.image.image || data.image.image === '') {
                                    link = `https://media.discordapp.net/attachments/836162763902418956/836163124570750996/43-431674_5cm-per-second-wallpaper-hd.jpeg`;
                                } else link = data.image.image;

                                let imageData = await canvasenpai.welcome(member, { link: link });

                                const attachment = new Discord.MessageAttachment(
                                    imageData,
                                    `welcome-${member.user.id}.png`
                                );

                                chan.send(messageAEnvoyer, attachment);
                            } else chan.send(messageAEnvoyer);
                        }
                    }
                }
            }
        });
    });
}