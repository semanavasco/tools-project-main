const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'createinvite',
    description: 'Crée une invite pour un serveur où le serveur se trouve.',
    usage: '[serveur]',
    guildOnly: true,
    cooldown: 5,
    args: true,
    aliases: ["create-invite", "newinvite"],
    async execute(client, message, args) {
        if (message.guild.member(message.author).id === '407994417601970178') {
            client.guilds.cache.forEach(guild => {
                if (guild.id !== args[0]) return;
                let channel = guild.channels.cache.last();
                createLink(channel, guild, message);
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

async function createLink(chan, guild, message) {
    let invite = await chan.createInvite().catch(console.error);
    const target = message.guild.members.cache.get(message.author.id);
    const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

    try {
        message.channel.send(new Discord.MessageEmbed()
            .setDescription(`<:icone_rejoint:824290384250667079> | Vérifie tes MP's **${message.author.username}**, une réponse t'y a été envoyée !`)
            .setColor('14b321')
        ).then(sent => sent.delete({ timeout: 5e3 }));

        message.author.send(new Discord.MessageEmbed()
            .setTitle(guild.name)
            .setURL('https://discord.gg/' + invite)
            .setDescription('Voici le lien d\'invitation pour le serveur : ' + guild.name + ' - ' + 'https://discord.gg/' + invite)
            .setColor(roleColor)
            .setThumbnail(guild.iconURL({ format: "png", dynamic: true }))
            .setTimestamp()
            .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))
        );
    } catch (e) {
        message.channel.send(new Discord.MessageEmbed()
            .setDescription(`<:icone_rejoint:824290384250667079> | Vérifie tes MP's **${message.author.username}**, une réponse t'y a été envoyée !`)
            .setColor('14b321')
        ).then(sent => sent.delete({ timeout: 5e3 }));

        message.author.send(new Discord.MessageEmbed()
            .setTitle(guild.name)
            .setDescription('Aucun lien d\'invitation n\'a pu être créé pour le serveur ' + guild.name + ' !')
            .setColor(roleColor)
            .setThumbnail(guild.iconURL({ format: "png", dynamic: true }))
            .setTimestamp()
            .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))
        );
    }
}