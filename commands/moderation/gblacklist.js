const Discord = require('discord.js');
const GiveawaysBlacklist = require('../../models/GiveawaysBlacklist.js');

module.exports = {
    name: 'gblacklist',
    description: 'Affiche la blacklist des giveaways !',
    usage: '',
    guildOnly: true,
    cooldown: 5,
    permissions: 'MANAGE_GUILD',
    async execute(client, message, args) {
        let position = 0;
        
        message.channel.send('**Liste des personnes Blacklist :**');

        message.guild.members.cache.forEach(member => {
            GiveawaysBlacklist.findOne({
                guildID: message.guild.id,
                userID: member.id
            }, async (err, data) => {
                if (err) console.log(err);

                let blacklisted = false;
                if (!data) blacklisted = false;
                else blacklisted = data.blacklisted;

                if (blacklisted === true) {
                    position += 1;

                    message.channel.send(`**${position}** - \`${member.user.username} (${member.user.id})\`\n`);
                } else return;
            });
        });
    },
};