const Discord = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Supprime un nombre de messages précis !',
    usage: '<messages>',
    guildOnly: true,
    cooldown: 5,
    args: true,
    permissions: 'MANAGE_MESSAGES',
    aliases: ['purge'],
    async execute(client, message, args) {
        const count = args[0];

        if (isNaN(count)) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Essaye à nouveau en spécifiant un "\`nombre\`".`)
                .setColor("d10000")

            return message.reply(embed);
        }
        if (count < 1 || count > 99) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Le nombre de messages à supprimer doit être compris entre "\`1 et 99\`".`)
                .setColor("d10000")

            return message.reply(embed);
        }

        const { size } = await message.channel.bulkDelete(Number(count) + 1, true)

        message.channel.send(new Discord.MessageEmbed()
            .setColor("14b321")
            .setDescription(`<:icone_verified:824290381435895818> | \`${size - 1}\` messages ont été supprimés !`)
        ).then(sent => sent.delete({timeout: 5e3}));
    },
};