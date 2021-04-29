const Discord = require('discord.js');
const GuildLogs = require('../../models/GuildLogs.js');

module.exports = async (client, channel) => {
    const fetchGuildAuditLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_DELETE'
    });

    const latestChannelDelete = fetchGuildAuditLogs.entries.first();
    const { executor } = latestChannelDelete;

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
                logsChannel = data.ModLogs;
                guildLogs = data.guildLogs;
            }

            if (!logsChannel || logsChannel === '') return;

            let embed = new Discord.MessageEmbed()
                .setTitle(`<:icone_indisponible:824290381222117396> | Nouveau Salon Supprimé !`)
                .setDescription(`L'utilisateur **<@${executor.id}> (\`${executor.id}\`)** a supprimé le salon **${channel}** !`)
                .addField(`Nouveau Salon Supprimé`, `${channel} (\`${channel.id}\`)`, true)
                .addField(`Suppresseur du Salon`, `<@${executor.id}> (\`${executor.id}\`)`, true)
                .setColor('d10000')
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