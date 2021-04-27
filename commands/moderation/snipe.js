const Discord = require('discord.js');

module.exports = {
    name: 'snipe',
    description: 'Envoie la dernière commande supprimée.',
    usage: '',
    guildOnly: true,
    cooldown: 5,
    aliases: ["snipes"],
    permissions: 'VIEW_AUDIT_LOG',
    execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        const msg = client.snipes.get(message.channel.id);

        const embed = new Discord.MessageEmbed()
            .setAuthor(msg.author, msg.member.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setDescription(`**Contenu du Message :**\n${msg.content}\n\n**Auteur :**\n${msg.member} (\`${msg.id}\`)`)
            .setFooter(`Sniped !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setTimestamp()
            .setColor(roleColor);

        message.channel.send(embed);
    },
}