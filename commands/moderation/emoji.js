const Discord = require('discord.js');
const { parse } = require('emoji-parser');

module.exports = {
    name: 'emoji',
    description: 'Ajoute ou enlève un emoji au serveur !',
    usage: '<add/remove> <emoji> {nom (si "add" est choisi)}',
    guildOnly: true,
    cooldown: 5,
    args: true,
    permissions: 'MANAGE_EMOJIS',
    async execute(client, message, args) {
        if (args[0] === 'add' || args[0] === 'ajoute') {
            const emoji = args[1];

            if (!emoji) {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('d10000')
                    .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas trouvé d'emoji valide dans votre message.`)
                );
            }

            let customemoji = Discord.Util.parseEmoji(emoji);
            if (customemoji.id) {
                const Link = `https://cdn.discordapp.com/emojis/${customemoji.id} .${customemoji.animated ? "gif" : "png"}`;

                const name = args.slice(2).join(' ');

                const newemoji = await message.guild.emojis.create(
                    `${Link}`,
                    `${name || customemoji.name}`
                ).catch(error => {
                    message.channel.send(new Discord.MessageEmbed()
                        .setColor('d10000')
                        .setDescription(`<:icone_indisponible:824290381222117396> | Une erreur est survenue lors de l'upload de l'emoji : \`${error}\`.`)
                    );
                });

                let animé = '';

                if (customemoji.animated) {
                    animé = `<a:${newemoji.name}:${newemoji.id}>`
                } else {
                    animé = `<:${newemoji.name}:${newemoji.id}>`
                }

                return message.channel.send(new Discord.MessageEmbed()
                    .setColor('14b321')
                    .setDescription(`<:icone_rejoint:824290384250667079> | L'emoji "${animé} (\`:${name || customemoji.name}:\`)" a correctement été ajouté !`)
                );
            }
            else {
                let checkemoji = parse(emoji, {
                    assetType: 'png'
                });

                if (!checkemoji[0]) {
                    message.channel.send(new Discord.MessageEmbed()
                        .setColor('d10000')
                        .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas trouvé d'emoji valide dans votre message.`)
                    );
                }

                message.channel.send(new Discord.MessageEmbed()
                    .setColor('14b321')
                    .setDescription(`<:icone_rejoint:824290384250667079> | Tu peux utiliser l'emoji normal !`)
                );
            }
        } else if (args[0] === 'remove' || args[0] === 'enlève') {
            let emoji = args[1];

            let customemoji = Discord.Util.parseEmoji(emoji);

            if (!message.guild.emojis.cache.get(customemoji.id)) {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('d10000')
                    .setDescription(`<:icone_indisponible:824290381222117396> | L'emoji que vous avez précisé n'existe pas dans ce serveur.`)
                )
            }
            else {
                message.guild.emojis.resolve(customemoji.id).delete().then(message.channel.send(new Discord.MessageEmbed()
                    .setColor('14b321')
                    .setDescription(`<:icone_verified:824290381435895818> | L'emoji "\`:${customemoji.name}:\`" a correctement été retiré !`)
                ));
            }
        }
    },
};