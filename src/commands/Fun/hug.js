const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

const { color } = require('./../../config/color.json')
const { hug } = require('./../../config/gif.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug another User.')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('The user you want to Hug.')
            .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target')
        const sender = interaction.user

        if (target.id !== sender.id) {

            let hugGif = hug[Math.floor(Math.random() * hug.length)]

            const hugEmbed = new EmbedBuilder()
                .setColor(color.default)
                .setDescription(`${sender} hugged ${target}`)
                .setImage(hugGif)
        
            await interaction.reply({ embeds: [hugEmbed] })
        }
        else {
            const errorHugEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setDescription(`You can't hug yourself.`)

            await interaction.reply({ embeds: [errorHugEmbed], flags: MessageFlags.Ephemeral })
        }
    }
}