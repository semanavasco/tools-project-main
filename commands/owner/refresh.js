const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'refresh',
    description: 'Redémarre une dite commande.',
    usage: '[commande]',
    guildOnly: true,
    cooldown: 5,
    args: true,
    aliases: ["reload"],
    execute(client, message, args) {
        const { commands } = message.client;
        
        if (message.guild.member(message.author).id === '407994417601970178') {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            const embed1 = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas trouvé de commande nommée "\`${command.name}\`".`)
                .setColor('d10000');

            if (!command) message.reply(embed1).then(sent => sent.delete({ timeout: 5e3 }));

            const commandFolders = fs.readdirSync('./commands');
            const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${name}.js`));

            delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

            try {
                const newCommand = require(`../${folderName}/${command.name}.js`);
                message.client.commands.set(newCommand.name, newCommand);

                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_verified:824290381435895818> | La commande "\`${command.name}\`" a correctement été rafraichie.`)
                    .setColor('14b321');

                message.reply(embed);
            } catch (error) {
                console.error(error);

                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Une erreur est survenue lors du redémarrage de la commande "\`${command.name}\`" :\n\`${error.message}\``)
                    .setColor('d10000');

                message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
            }
        }
        else {
            message.channel.send(new Discord.MessageEmbed()
                .setColor('d10000')
                .setDescription(`<:icone_indisponible:824290381222117396> | Seul le "\`créateur\`" du bot peut effectuer cette commande.`)
            ).then(sent => sent.delete({ timeout: 5e3 }));
        }
    },
};