const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'roleinfo',
    description: 'Envoie les infos du rôle mentionné !',
    usage: '<rôle>',
    guildOnly: true,
    cooldown: 5,
    args: true,
    aliases: ["ri", "role-info"],
    execute(client, message, args) {
        const role = message.mentions.roles.first() || message.guild.roles.cache.find(role => role.name === args.slice(0).join(' ')) || message.guild.roles.cache.find(role => role.id === args[0]);

        message.channel.send(new Discord.MessageEmbed()
            .addField('Nom du Rôle', role.name, true)
            .addField('Aperçu', role, true)
            .addField('ID du Rôle', role.id)
            .addField('Couleur du Rôle', role.hexColor, true)
            .addField('Création', moment(role.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss'), true)
            .addField('Nb d\'Utilisateurs avec ce Rôle', role.members.size, true)
            .addField('Affiché Séparément', role.hoist ? ':white_check_mark:' : ':x:', true)
            .addField('Mentionnable', role.mentionable ? ':white_check_mark:' : ':x:', true)
            .setColor(role.hexColor)
        );
    },
};