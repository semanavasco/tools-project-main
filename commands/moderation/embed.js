const Discord = require('discord.js');

module.exports = {
    name: 'embed',
    description: 'Envoie le message en EMBED !',
    usage: '{couleur HEX} ## {titre} ## {description} ## {lien de l\'image}',
    guildOnly: true,
    cooldown: 5,
    args: true,
    permissions: 'MANAGE_MESSAGES',
    execute(client, message, args) {
        if (message.deletable) message.delete();

        const color = args.join(' ').split('##')[0]
        const title = args.join(' ').split('##')[1]
        const desc = args.join(' ').split('##')[2]
        const pic = args.join(' ').split('##')[3]

        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(title)
            .setDescription(desc)
            .setImage(pic);

        message.channel.send(embed);
    },
};