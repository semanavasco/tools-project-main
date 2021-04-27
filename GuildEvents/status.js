const Discord = require('discord.js');
const GuildStatus = require('../models/GuildStatus.js');

module.exports = async (client) => {
    setInterval(() => {
        client.guilds.cache.forEach(async (guild) => {
            GuildStatus.findOne({
                guildID: guild.id
            }, async (err, data) => {
                if (err) console.log(err);

                if (!data) {
                    const newData = new GuildStatus({
                        name: guild.name,
                        guildID: guild.id,
                        onoff: false,
                        role: '',
                        status: ''
                    });

                    newData.save().catch(err => console.log(err));
                }

                if (data.onoff === false) return;
                if (!data.status || data.status === '') return;
                if (!data.role || data.role === '') return;

                guild.members.cache.forEach(async (user) => {
                    try {
                        if (user.user.presence.activities[0].state.includes(data.status)) {
                            user.roles.add(data.role);
                        } else {
                            if (user.roles.cache.get(data.role)) {
                                user.roles.remove(data.role);
                            } else return;
                        }
                    } catch (error) {
                        
                    }
                });
            });
        });
    }, 300000);
}