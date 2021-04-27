const Discord = require('discord.js');

module.exports = {
    name: 'roll',
    description: 'Laisse le bot choisir un nombre au hasard entre 0 et ton chiffre !',
    usage: '<chiffre>',
    guildOnly: false,
    cooldown: 5,
    args: true,
    execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        if (isNaN(args[0])) return message.reply('<:icone_indisponible:824290381222117396> : essaye en spécifiant un nombre !').then(sent => sent.delete({ timeout: 5e3 }));

        let x = Math.floor(Math.random() * args[0]) + 1;

        const Rembed = new Discord.MessageEmbed()
            .setColor(roleColor)
            .setAuthor(`${message.author.username}`)
            .setTimestamp()
            .setFooter(`Roll !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setDescription(`:game_die: | Bravo, tu as roll : **${x}**`);

        message.channel.send(Rembed);
    },
};