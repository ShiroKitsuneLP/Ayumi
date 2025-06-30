const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

const { color } = require('./../../config/color.json')
const { pat } = require('./../../config/gif.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('Pat another User.')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('The user you want to Pat.')
            .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target')
        const sender = interaction.user

        if (target.id !== sender.id) {

            let patGif = pat[Math.floor(Math.random() * pat.length)]

            const patEmbed = new EmbedBuilder()
                .setColor(color.default)
                .setDescription(`${sender} patted ${target}`)
                .setImage(patGif)
        
            await interaction.reply({ embeds: [patEmbed] })
        }
        else {
            const errorPatEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setDescription(`You can't pat yourself.`)

            await interaction.reply({ embeds: [errorPatEmbed], flags: MessageFlags.Ephemeral })
        }
    }
}