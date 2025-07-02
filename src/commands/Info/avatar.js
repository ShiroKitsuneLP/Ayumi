const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { color } = require('./../../config/color.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Replies with the Avatar from the User.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The User you want the Avatar from.')
                .setRequired(true)
        ),
    usage: '/avatar <User>',
    async execute(interaction, ayumi) {
        const target = interaction.options.getUser('target')

        const avatarEmbed = new EmbedBuilder()
            .setColor(color.default)
            .setTitle(`${target.username}'s Avatar`)
            .setAuthor({
                name: ayumi.user.username,
                iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .setImage(target.displayAvatarURL({ dynamic: true, size: 2048 }))
        
        await interaction.reply({ embeds: [avatarEmbed] })
    }
}