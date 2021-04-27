const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'Crée une invite pour le serveur officiel du bot.',
    usage: '',
    guildOnly: true,
    cooldown: 5,
    async execute(client, message, args) {
        client.guilds.cache.forEach(guild => {
            if (guild.id !== '808750564468195344') return;
            let channel = guild.channels.cache.last();
            createLink(channel, guild, message);
        });
    },
}

async function createLink(chan, guild, message) {
    let invite = await chan.createInvite().catch(console.error);
    const target = message.guild.members.cache.get(message.author.id);
    const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

    message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Serveur Officiel du Bot`)
        .setURL('https://discord.gg/' + invite)
        .setDescription('Voici le lien d\'invitation pour le serveur du bot :\n' + 'https://discord.gg/' + invite)
        .addField(`<:icone_rejoint:824290384250667079> - Membres`, message.guild.memberCount, true)
        .setColor(roleColor)
        .setThumbnail(guild.iconURL({ format: "png", dynamic: true }))
        .setTimestamp()
        .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))
    );
}