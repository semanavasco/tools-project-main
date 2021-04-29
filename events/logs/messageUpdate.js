const Discord = require('discord.js');
const GuildLogs = require('../../models/GuildLogs.js');
const GuildOptions = require('../../models/GuildOptions.js');

module.exports = async (client, oldMessage, newMessage) => {
    let prefix = '';

    GuildOptions.findOne({
        guildID: newMessage.guild.id
    }, async (err, data) => {
        if (err) console.log(err);

        if (!data) {
            const newData = new GuildOptions({
                name: newMessage.guild.name,
                guildID: newMessage.guild.id,
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

        if (!newMessage.content.startsWith(prefix) || newMessage.author.bot || oldMessage.content.startsWith(prefix)) return;

        // COMMAND SET
        const args = newMessage.content.slice(prefix.length).trim().split(/ +/);
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

            return newMessage.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        // GUILD MESSAGES
        if (command.guildOnly && newMessage.channel.type === 'dm') {
            const embed = new Discord.MessageEmbed()
                .setDescription('<:icone_indisponible:824290381222117396> | Je ne peux pas exécuter cette commande dans les **MP\'s**.')
                .setColor('d10000')

            return newMessage.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        // PERMISSIONS
        if (newMessage.guild.member(newMessage.author).id !== '407994417601970178' && command.permissions) {
            const authorPerms = newMessage.channel.permissionsFor(newMessage.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Tu ne peux pas effectuer cette commande car tu ne possèdes pas la/les permission(s) requises : "\`${command.permissions}\`".`)
                    .setColor('d10000')

                return newMessage.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
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

        if (timestamps.has(newMessage.author.id) && newMessage.guild.member(newMessage.author).id !== '407994417601970178') {
            const expirationTime = timestamps.get(newMessage.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Attendez encore **${timeLeft.toFixed(1)} seconde(s)** avant d'utiliser la commande "\`${command.name}\`".`)
                    .setColor('d10000')

                return newMessage.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
            }
        }

        if (newMessage.guild.member(newMessage.author).id !== '407994417601970178') {
            timestamps.set(newMessage.author.id, now);
        }
        setTimeout(() => timestamps.delete(newMessage.author.id), cooldownAmount);

        // RUN COMMANDS
        try {
            command.execute(client, newMessage, args);
        } catch (error) {
            console.error(error);
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Une erreur s'est produite lors de l'exécution de la commande "\`${command.name}\`".`)
                .setColor('d10000')

            newMessage.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }
    });

    if (oldMessage.author.bot) return;
    try {
        GuildLogs.findOne({
            guildID: newMessage.guild.id
        }, async (err, data) => {
            if (err) console.log(err);
            let logsChannel = '';
            let guildLogs = false;

            if (!data) {
                const newData = new GuildLogs({
                    name: newMessage.guild.name,
                    guildID: newMessage.guild.id,
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
                .setTitle(`<:icone_indisponible:824290381222117396> | Message Modifié !`)
                .setDescription(`L'utilisateur **${oldMessage.author} (\`${oldMessage.author.id}\`)** a modifié un message dans le salon **<#${oldMessage.channel.id}>** !`)
                .addField(`Ancien Contenu du Message`, oldMessage.content, true)
                .addField(`Nouveau Contenu du Message`, newMessage.content, true)
                .setColor('d10000')
                .setTimestamp()
                .setFooter(oldMessage.author.username, oldMessage.author.displayAvatarURL({ format: "png", dynamic: true }))

            let channel = oldMessage.guild.channels.cache.find(
                (ch) => ch.id === logsChannel
            );
            if (!channel) return;
            if (guildLogs === false) return;
            channel.send(embed);
        });
    } catch (e) {
        console.log(e);
    }
}