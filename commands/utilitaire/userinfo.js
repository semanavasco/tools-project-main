const Discord = require('discord.js');
const moment = require('moment');

const flags = {
    DISCORD_EMPLOYEE: '<:badge_staff:824290372758274058>',
    PARTNERED_SERVER_OWNER: '<:partner_new:824290373152538624>',
    HYPESQUAD_EVENTS: '<:badge_hypesquad:824290372573331527>',
    HOUSE_BRAVERY: '<:badge_bravery:824290379070439446>',
    HOUSE_BRILLIANCE: '<:badge_brilliance:824290379028758580>',
    HOUSE_BALANCE: '<:badge_balance:824290378458726400>',
    BUGHUNTER_LEVEL_1: '<:badge_green_bughunter:824290378726637608>',
    BUGHUNTER_LEVEL_2: '<:badge_gold_bughunter:824290378399350824>',
    EARLY_VERIFIED_BOT_DEVELOPER: '<:badge_developpeur:824290378718511125>',
    EARLY_SUPPORTER: '<:badge_early_supporter:824290378701340672>',
    VERIFIED_BOT: '<:robot:824290379100454962>',
    TEAM_USER: 'Team User',
    SYSTEM: 'Système'
}

module.exports = {
    name: 'userinfo',
    description: 'Envoie tes infos ou celles sur l\'utilisateur mentionné !',
    usage: '{mention}',
    guildOnly: false,
    cooldown: 5,
    aliases: ["ui", "whois"],
    execute(client, message, args) {
        const member = message.mentions.users.first() || message.guild.members.cache.find(user => user.id === args[0]) || message.author;
        const target = message.guild.members.cache.get(member.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        let userinfo = {};
        userinfo.avatar = member.displayAvatarURL({ format: 'png', dynamic: true });
        userinfo.name = member.username;
        userinfo.discrim = `#${member.discriminator}`;
        userinfo.id = member.id;
        userinfo.status = member.presence.status;

        if (userinfo.status === 'online') {
            userinfo.status = 'En-Ligne';
        }
        else if (userinfo.status === 'dnd') {
            userinfo.status = 'Ne Pas Déranger';
        }
        else if (userinfo.status === 'idle') {
            userinfo.status = 'AFK';
        }
        else if (userinfo.status === 'offline') {
            userinfo.status = 'Absent';
        }

        const userFlags = target.user.flags.toArray();
        const roles = target.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);

        const embed = new Discord.MessageEmbed()
            .setColor(roleColor)
            .setFooter(member.tag, userinfo.avatar)
            .setTimestamp()
            .setThumbnail(userinfo.avatar)
            .addField(`<:icone_dmd:824290383965585410> - Nom d'Utilisateur`, userinfo.name, true)
            .addField(`<:icone_role:824290384204660806> - Tag de l'Utilisateur`, userinfo.discrim, true)
            .addField(`<:icone_textchannel:824290380924452914> - Nom Affiché`, target.nickname || `${userinfo.name}`, true)
            .addField(`<:icone_carte:824290384506257438> - ID de l'Utilisateur`, userinfo.id, true)
            .addField(`<:badge_staff:824290372758274058> - Compte Créé`, `${moment(member.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`, true)
            .addField(`<:icone_rejoint:824290384250667079> - A Rejoint`, `${moment(message.guild.members.cache.get(member.id).joinedAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`, true)
            .addField(`\u200b`, `\u200b`)
            .addField(`<:icone_discovery:824290381826097222> - Status`, userinfo.status, true)
            .addField(`<:badge_boost:824290382644117545> - Badges [${userFlags.length}]`, `${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'Aucun'}`, true)
            .addField(`<:badge_early_supporter:824290378701340672> - Rôles [${roles.length}]`, `${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? trimArray(roles) : 'Aucun'}`)

        message.channel.send(embed);
    },
};

function trimArray(arr, maxLen = 10) {
    if (arr.length > maxLen) {
        const len = arr.length - maxLen;
        arr = arr.slice(0, maxLen);
        arr.push(`${len} autres...`);
    }
    return arr;
}