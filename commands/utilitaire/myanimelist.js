const Discord = require('discord.js');
const Jikan = require('jikan-node');
const mal = new Jikan();
const translate = require('@iamtraction/google-translate');

module.exports = {
    name: 'myanimelist',
    description: 'Envoie les informations sur le manga/anime/personnage mentionné !',
    usage: '<type> <recherche>',
    guildOnly: true,
    cooldown: 5,
    args: true,
    aliases: ["mal"],
    async execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        if (args[0] === 'anime') {
            mal.search('anime', args.slice(1).join(' '), 'page').then(async info => {
                let desc = '';
                await translate(`${info.results[0].synopsis}`, { from: 'en', to: 'fr' }).then(res => {
                    desc += `${res.text}`
                }).catch(err => {
                    console.error(err);
                });

                const embed = new Discord.MessageEmbed()
                    .setAuthor(`MyAnimeList`, `https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png`, 'https://myanimelist.net/')
                    .setColor(roleColor)
                    .setTitle(`${info.results[0].title}`)
                    .setURL(`${info.results[0].url}`)
                    .setDescription(`${desc}`)
                    .addField(`Score`, `${info.results[0].score} ⭐`, true)
                    .addField(`Type`, `${info.results[0].type}`, true)
                    .addField(`Rank`, `${info.results[0].rated}`, true)
                    .setThumbnail(`${info.results[0].image_url}`)
                    .setTimestamp()
                    .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

                message.channel.send(embed);
            }).catch(error => {
                console.log(error);
                if (error === 'Response: 404') {
                    const embed = new Discord.MessageEmbed()
                        .setDescription('<:icone_indisponible:824290381222117396> | Je n\'ai pas trouvé l\'anime mentionné, essayez peut-être plus tard.')
                        .setColor('d10000')

                    return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setDescription('<:icone_indisponible:824290381222117396> | Je n\'ai pas trouvé l\'anime mentionné, essayez peut-être plus tard.')
                        .setColor('d10000')

                    return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
                }
            });
        } else if (args[0] === 'personnage' || args[0] === 'perso' || args[0] === 'character') {
            mal.search('character', args.slice(1).join(' '), 'page').then(async info => {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`MyAnimeList`, `https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png`, 'https://myanimelist.net/')
                    .setColor(roleColor)
                    .setTitle(`${info.results[0].name}`)
                    .setURL(`${info.results[0].url}`)
                    .setImage(`${info.results[0].image_url}`)
                    .setTimestamp()
                    .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

                message.channel.send(embed);
            }).catch(error => {
                console.log(error);
                if (error === 'Response: 404') {
                    const embed = new Discord.MessageEmbed()
                        .setDescription('<:icone_indisponible:824290381222117396> | Je n\'ai pas trouvé le personnage mentionné, essayez peut-être plus tard.')
                        .setColor('d10000')

                    return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setDescription('<:icone_indisponible:824290381222117396> | Je n\'ai pas trouvé le personnage mentionné, essayez peut-être plus tard.')
                        .setColor('d10000')

                    return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
                }
            });
        } else if (args[0] === 'manga') {
            mal.search('manga', args.slice(1).join(' '), 'page').then(async info => {
                let desc = '';
                await translate(`${info.results[0].synopsis}`, { from: 'en', to: 'fr' }).then(res => {
                    desc += `${res.text}`
                }).catch(err => {
                    console.error(err);
                });

                const embed = new Discord.MessageEmbed()
                    .setAuthor(`MyAnimeList`, `https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png`, 'https://myanimelist.net/')
                    .setColor(roleColor)
                    .setTitle(`${info.results[0].title}`)
                    .setURL(`${info.results[0].url}`)
                    .setDescription(`${desc}`)
                    .addField(`Score`, `${info.results[0].score} ⭐`, true)
                    .addField(`Type`, `${info.results[0].type}`, true)
                    .setThumbnail(`${info.results[0].image_url}`)
                    .setTimestamp()
                    .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

                message.channel.send(embed);
            }).catch(error => {
                console.log(error);
                if (error === 'Response: 404') {
                    const embed = new Discord.MessageEmbed()
                        .setDescription('<:icone_indisponible:824290381222117396> | Je n\'ai pas trouvé le personnage mentionné, essayez peut-être plus tard.')
                        .setColor('d10000')

                    return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setDescription('<:icone_indisponible:824290381222117396> | Je n\'ai pas trouvé le personnage mentionné, essayez peut-être plus tard.')
                        .setColor('d10000')

                    return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
                }
            });
        } else {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas trouvé le type que vous avez précisé, essayez avec "\`manga/anime/personnage\`".`)
                .setColor('d10000')

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }
    },
};