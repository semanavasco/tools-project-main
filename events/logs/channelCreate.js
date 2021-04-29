const Discord = require('discord.js');
const GuildLogs = require('../../models/GuildLogs.js');

module.exports = async (client, channel) => {
    const fetchGuildAuditLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_CREATE'
    });

    const latestChannelCreated = fetchGuildAuditLogs.entries.first();
    const { executor } = latestChannelCreated;

    if (executor.bot) return;
    try {
        GuildLogs.findOne({
            guildID: channel.guild.id
        }, async (err, data) => {
            if (err) console.log(err);
            let logsChannel = '';
            let guildLogs = false;

            if (!data) {
                const newData = new GuildLogs({
                    name: channel.guild.name,
                    guildID: channel.guild.id,
                    logsChannel: '',
                    guildLogs: false,
                    userLogs: false
                });
                newData.save().catch(err => console.log(err));

                logsChannel = '';
            }
            else {
                logsChannel = data.logsChannel;
                guildLogs = data.guildLogs;
            }

            if (!logsChannel || logsChannel === '') return;

            let embed = new Discord.MessageEmbed()
                .setTitle(`<:icone_verified:824290381435895818> | Nouveau Salon Créé !`)
                .setDescription(`L'utilisateur **<@${executor.id}> (\`${executor.id}\`)** a créé le salon **${channel}** !`)
                .addField(`Nouveau Salon Créé`, `${channel} (\`${channel.id}\`)`, true)
                .addField(`Créateur du Salon`, `<@${executor.id}> (\`${executor.id}\`)`, true)
                .setColor('14b321')
                .setTimestamp()
                .setFooter(executor.username, executor.displayAvatarURL({ format: "png", dynamic: true }))

            let chan = channel.guild.channels.cache.find(
                (ch) => ch.id === logsChannel
            );
            if (!chan) return;
            if (guildLogs === false) return;
            chan.send(embed);
        });
    } catch (e) {
        console.log(e);
    }
}