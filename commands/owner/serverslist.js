const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'serverslist',
    description: 'Envoie la liste de tous les serveurs où le bot se trouve.',
    usage: '',
    guildOnly: true,
    cooldown: 5,
    aliases: ["serverlist", "listeserveurs", "allservers", "allservs"],
    async execute(client, message, args) {
        let pages = [];
        let currentPage = 0;

        if (message.guild.member(message.author).id === '407994417601970178') {
            await finder(client, message, pages);

            const serversListEmbed = await message.channel.send(`Page : ${currentPage + 1}/${pages.length}`, pages[currentPage])
            await serversListEmbed.react('⬅️');
            await serversListEmbed.react('➡️');

            const collector = serversListEmbed.createReactionCollector(reactionFilter);

            collector.on('collect', (reaction, user) => {
                if (reaction.emoji.name === '➡️') {
                    if (currentPage < pages.length - 1) {
                        currentPage += 1;
                        serversListEmbed.edit(`Page : ${currentPage + 1}/${pages.length}`, pages[currentPage]);
                    }
                } else if (reaction.emoji.name === '⬅️') {
                    if (currentPage !== 0) {
                        currentPage -= 1;
                        serversListEmbed.edit(`Page : ${currentPage + 1}/${pages.length}`, pages[currentPage]);
                    }
                }
            });
        }
        else {
            message.channel.send(new Discord.MessageEmbed()
                .setColor('d10000')
                .setDescription(`<:icone_indisponible:824290381222117396> | Seul le "\`créateur\`" du bot peut effectuer cette commande.`)
            ).then(sent => sent.delete({ timeout: 5e3 }));
        }
    },
}

async function finder(client, message, pages) {
    let NuméroServeur = 0;
    let desc = ``;
    client.guilds.cache.forEach((guild) => {
        desc += `${NuméroServeur += 1} - **${guild.name}** - ${guild.memberCount} membre(s)\n ID - (\`${guild.id}\`)\n`;
    });
    const target = message.guild.members.cache.get(message.author.id);
    const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

    for (let i = 0; i < desc.length; i += 2048) {
        const description = desc.substring(i, Math.min(desc.length, i + 2048));

        const msg = new Discord.MessageEmbed()
            .setTitle(`Serverslist - ${client.user.username}`)
            .setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setDescription(`__**Nombre de Serveurs : ${client.guilds.cache.size}**__\n\n` + description)
            .setColor(roleColor)
            .setTimestamp()
            .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        pages.push(msg);
    }
}