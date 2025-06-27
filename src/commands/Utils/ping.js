const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { color } = require('./../../config/color.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong.'),
	async execute(interaction) {
		const pingEmbed = new EmbedBuilder()
			.setColor(color.default)
			.setTitle('Pong!')
			.setFields(
				{ name: 'Ping', value: 'Pinging...', inline: true },
				{ name: 'API Latency', value: 'Pinging...', inline: true }
			)

		const sent = await interaction.reply({ embeds: [pingEmbed] })

		const ping = sent.createdTimestamp - interaction.createdTimestamp
		const latency = Math.round(interaction.client.ws.ping)

		pingEmbed.setFields(
			{ name: 'Ping', value: `${ping}ms`, inline: true },
			{ name: 'API Latency', value: `${latency}ms`, inline: true }
		)

		await interaction.editReply({ embeds: [pingEmbed] })
	},
}