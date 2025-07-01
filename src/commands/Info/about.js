const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js')

const { color } = require('./../../config/color.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Information about the Bot.'),
    async execute(interaction, ayumi) {
        let totalUsers = 0

        // All Users over all Servers
        for(const guild of ayumi.guilds.cache.values()) {
            try {
                const members = await guild.members.fetch()
                const humans = members.filter(member => !member.user.bot)
                totalUsers += humans.size
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
            .setDescription('A few little things about me~')
            .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .addFields(
                { name: 'Bot ID', value: ayumi.user.id, inline: false },

                { name: 'Bot Version', value: 'v1.0.0', inline: true },
                { name: 'discord.js', value: `v${version}`, inline: true },
                { name: 'Node.js', value: process.version, inline: true },

                { name: 'Servers', value: `${ayumi.guilds.cache.size}`, inline: true },
                { name: 'Users', value: `${totalUsers}`, inline: true },

                { name: 'Developer', value: '[ShiroKitsune](https://github.com/ShiroKitsuneLP)', inline: false },

                { name: '', value: '', inline: false },

                { name: 'Personality', value: 'Cute, helpful & always online~', inline: false },
                { name: 'Powered by', value: 'JavaScript & sweet server hugs~', inline: false }
            )

        await interaction.reply({ embeds: [aboutEmbed] })
    }
}