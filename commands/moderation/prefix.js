const Discord = require('discord.js');
const GuildOptions = require('../../models/GuildOptions.js');

module.exports = {
    name: 'prefix',
    description: 'Change le prefix du serveur !',
    usage: '<prefix>',
    guildOnly: true,
    cooldown: 5,
    args: true,
    permissions: 'MANAGE_GUILD',
    async execute(client, message, args) {
        GuildOptions.findOne({
            guildID: message.guild.id
        }, async (err, data) => {
            if (err) console.log(err);
            if (!data) {
                const newData = new GuildOptions({
                    name: message.guild.name,
                    guildID: message.guild.id,
                    prefix: args[0],
                    AntiLink: false,
                    AntiSpam: false,
                    AntiInsults: false
                })
                newData.save().catch(err => console.log(err));
            }
            else {
                data.prefix = args[0];
                data.save();
            }
        });

        message.channel.send(new Discord.MessageEmbed()
            .setDescription(`<:icone_verified:824290381435895818> | Prefix du serveur changé avec succès. Nouveau prefix : \`${args[0]}\``)
            .setColor(`14b321`)
        );
    },
};