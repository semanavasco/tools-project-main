const Discord = require('discord.js');

module.exports = {
	name: 'args-info',
	description: 'Informations sur les arguments donnés.',
	usage: '<arguments>',
	guildOnly: true,
	cooldown: 5,
	args: true,
	aliases: ["ai", "a-i"],
	execute(client, message, args) {
		const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

		message.channel.send(new Discord.MessageEmbed()
			.setDescription(`Arguments: ${args}\nTaille des arguments: ${args.length}`)
			.setColor(roleColor)
		);
	},
};