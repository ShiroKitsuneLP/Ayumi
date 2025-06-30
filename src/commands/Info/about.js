const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

const { color } = require('./../../config/color.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Information about the Bot.'),
    async execute(interaction, ayumi) {

        let totalUser = 0

        for(const guild of ayumi.guilds.cache.values()) {
            try {
                const members = await guild.members.fetch()
                const humans = members.filter(member => !member.user.bot)
                totalUser += humans.size
            } catch(error) {
                console.error(`Error loading ${guild.name}:`, error)
            }
        }

        const aboutEmbed = new EmbedBuilder()
            .setColor(color.default)
            .setTitle(`About ${ayumi.user.username}`)
            .setAuthor({
                name: ayumi.user.username,
                iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .setDescription('All Information about the Bot.')
            .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .addFields(
                { name: 'Bot ID', value: ayumi.user.id, inline: true },
                { name: 'Version', value: 'v1.0.0', inline: true },
                { name: 'Developer', value: '[ShiroKitsune](https://github.com/ShiroKitsuneLP)' },
                { name: 'Server', value: `${ayumi.guilds.cache.size}`, inline: true},
                { name: 'Users', value: `${totalUser}`, inline: true},
            )

        await interaction.reply({ embeds: [aboutEmbed] })
    }
}