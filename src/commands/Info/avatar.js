const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { color } = require('./../../config/color.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Replies with the Avatar from the User.')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('The User you want the Avatar from.')
            .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target')

        const avatarEmbed = new EmbedBuilder()
            .setColor(color.default)
            .setTitle(`${target.username}'s Avatar`)
            .setImage(target.displayAvatarURL({ dynamic: true, size: 2048 }))
        
        await interaction.reply({ embeds: [avatarEmbed] })
    }
}