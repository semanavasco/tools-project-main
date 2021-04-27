const config = require('../../config.js');
const Discord = require('discord.js');
const Levels = require('discord-xp');
Levels.setURL(config.mongo_LEVELING);
const GuildOptions = require('../../models/GuildOptions.js');
const GuildStatus = require('../../models/GuildStatus.js');
const LevelingMessage = require('../../models/LevelingMessage.js');

module.exports = async (client, message) => {
    let prefix = '';

    GuildOptions.findOne({
        guildID: message.guild.id
    }, async (err, data) => {
        if (err) console.log(err);

        if (!data) {
            const newData = new GuildOptions({
                name: message.guild.name,
                guildID: message.guild.id,
                prefix: '$',
                AntiLink: false,
                AntiSpam: false,
                AntiInsults: false
            })
            newData.save().catch(err => console.log(err));

            prefix = await '$';
        }
        else {
            prefix = await data.prefix;
        }

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        // COMMAND SET
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        // ARGUMENTS
        if (command.args && !args.length) {
            var embed = new Discord.MessageEmbed()
                .setColor('d10000')

            var reply = '<:icone_indisponible:824290381222117396> | Tu as donné **0** arguments, hors la commande en a besoin.'

            if (command.usage) {
                reply += `\nLe bon usage serait : "\`${prefix}${command.name} ${command.usage}\`".`;
            }

            embed.setDescription(reply);

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        // GUILD MESSAGES
        if (command.guildOnly && message.channel.type === 'dm') {
            const embed = new Discord.MessageEmbed()
                .setDescription('<:icone_indisponible:824290381222117396> | Je ne peux pas exécuter cette commande dans les **MP\'s**.')
                .setColor('d10000')

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        // PERMISSIONS
        if (message.guild.member(message.author).id !== '407994417601970178' && command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Tu ne peux pas effectuer cette commande car tu ne possèdes pas la/les permission(s) requises : "\`${command.permissions}\`".`)
                    .setColor('d10000')

                return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
            }
        }

        // COOLDOWNS
        const { cooldowns } = client;

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id) && message.guild.member(message.author).id !== '407994417601970178') {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Attendez encore **${timeLeft.toFixed(1)} seconde(s)** avant d'utiliser la commande "\`${command.name}\`".`)
                    .setColor('d10000')

                return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
            }
        }

        if (message.guild.member(message.author).id !== '407994417601970178') {
            timestamps.set(message.author.id, now);
        }
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // RUN COMMANDS
        try {
            command.execute(client, message, args);
        } catch (error) {
            console.error(error);
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Une erreur s'est produite lors de l'exécution de la commande "\`${command.name}\`".`)
                .setColor('d10000')

            message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }
    });

    // LEVELS
    LevelingMessage.findOne({
        guildID: message.guild.id
    }, async (err, data) => {
        if (err) console.log(err);

        let onoff = false;
        let levelingMessage = '';
        let levelingChannel = '';
        let messageActivate = false;
        let channelActivate = false;

        if (!data) {
            const newData = new LevelingMessage({
                name: message.guild.name,
                guildID: message.guild.id,
                onoff: false,
                messageActivate: false,
                message: '',
                channelActivate: false,
                channel: ''
            })
            newData.save().catch(err => console.log(err));
        }

        else {
            onoff = data.onoff;
            levelingMessage = data.message;
            levelingChannel = data.channel;
            messageActivate = data.messageActivate;
            channelActivate = data.channelActivate;

            // LEVELS
            if (!message.guild) return;
            if (message.author.bot) return;
            if (onoff === false) {
                return;
            } else {
                let randomXp = 0;

                if (message.content.length < 5) return;
                else if (message.content.length > 5 && message.content.length < 500) {
                    randomXp = Math.floor(Math.random() * 9) + 1;
                }
                else if (message.content.length > 500 && message.content.length < 1000) {
                    randomXp = Math.floor(Math.random() * 14) + 1;
                }
                else if (message.content.length > 1000 && message.content.length) {
                    randomXp = Math.floor(Math.random() * 19) + 1;
                }

                const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, Number(randomXp));
                if (hasLeveledUp) {
                    const user = await Levels.fetch(message.author.id, message.guild.id);
                    if (messageActivate === false) {
                        levelingMessage = `<a:dance_stickman:824344898589294595> | Bravo ${message.author}, tu as monté de niveau et es actuellement au niveau **${user.level}** ! Continue comme ça !`
                    }

                    if (channelActivate === false) {
                        levelingChannel = message.channel.id;
                    }

                    const messageAEnvoyer = await levelingMessage.replace("{user}", `${message.author}`);
                    const messageQuiEstEnvoye = await messageAEnvoyer.replace("{level}", `${user.level}`);

                    const channel = client.channels.cache.find(channel => channel.id === levelingChannel);

                    channel.send(`${messageQuiEstEnvoye}`);
                }
            }
        }
    });

    // STATUS
    GuildStatus.findOne({
        guildID: message.guild.id
    }, async (err, data) => {
        if (err) console.log(err);

        if (!data) {
            const newData = new GuildStatus({
                name: message.guild.name,
                guildID: message.guild.id,
                onoff: false,
                role: '',
                status: ''
            });

            newData.save().catch(err => console.log(err));
        }
    });
}