const Discord = require('discord.js');
const moment = require('moment');

const verificationLevels = {
    NONE: 'Aucun',
    LOW: 'Faible',
    MEDIUM: 'Moyen',
    HIGH: '(╯°□°）╯︵ ┻━┻',
    VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
    brazil: 'Brazil',
    europe: 'Europe',
    hongkong: 'Hong Kong',
    india: 'India',
    japan: 'Japan',
    russia: 'Russia',
    singapore: 'Singapore',
    southafrica: 'South Africa',
    sydeny: 'Sydeny',
    'us-central': 'US Central',
    'us-east': 'US East',
    'us-west': 'US West',
    'us-south': 'US South'
};

module.exports = {
    name: 'serverinfo',
    description: 'Envoie les infos du serveur !',
    usage: '',
    guildOnly: true,
    cooldown: 5,
    aliases: ["si"],
    execute(client, message, args) {
        const roleColor = message.guild.members.cache.get(message.author.id).displayHexColor === "#000000" ? "#ffffff" : message.guild.members.cache.get(message.author.id).displayHexColor;
        const emojis = message.guild.emojis.cache;
        
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Informations - ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
            .setColor(roleColor)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField(`<:icone_couronne:824290382614626354> - Propriétaire du Serveur`, `${message.guild.owner.user}\n(\`${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}\`)`, true)
            .addField(`<:icone_carte:824290384506257438> - ID du Serveur`, message.guild.id, true)
            .addField(`\u200b`, `\u200b`)
            .addField(`<:icone_rejoint:824290384250667079> - Membres`, message.guild.memberCount, true)
            .addField(`<:icone_discovery:824290381826097222> - En-Ligne`, message.guild.members.cache.filter(mem => mem.presence.status != "offline").size, true)
            .addField(`<:robot:824290379100454962> - Bots`, message.guild.members.cache.filter(mem => mem.user.bot === true).size, true)
            .addField(`<:badge_boost:824290382644117545> - Boosts du Serveur`, `${message.guild.premiumSubscriptionCount || '0'} (\`${message.guild.premiumTier ? `Niveau ${message.guild.premiumTier}` : 'Aucun'}\`)`, true)
            .addField(`<:icone_role:824290384204660806> - Rôles`, message.guild.roles.cache.size, true)
            .addField(`<:icone_textchannel:824290380924452914> - Salons`, message.guild.channels.cache.size, true)
            .addField(`<:icone_dmd:824290383965585410> - Région`, regions[message.guild.region], true)
            .addField(`<:icone_rules:824290381650460692> - Niveau de Vérification`, verificationLevels[message.guild.verificationLevel], true)
            .addField(`<:badge_staff:824290372758274058> - Création du Serveur`, `${moment(message.guild.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`, true)
            .addField(`<:badge_early_supporter:824290378701340672> - Nombre d'Emojis`, emojis.size, true)

        message.channel.send(embed);
    },
};