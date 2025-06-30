const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

const { color } = require('./../../config/color.json')
const { kiss } = require('./../../config/gif.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Kiss another User.')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('The user you want to Kiss.')
            .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target')
        const sender = interaction.user

        if (target.id !== sender.id) {

            let kissGif = kiss[Math.floor(Math.random() * kiss.length)]

            const kissEmbed = new EmbedBuilder()
                .setColor(color.default)
                .setDescription(`${sender} kissed ${target}`)
                .setImage(kissGif)
        
            await interaction.reply({ embeds: [kissEmbed] })
        }
        else {
            const errorKissEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setDescription(`You can't kiss yourself.`)

            await interaction.reply({ embeds: [errorKissEmbed], flags: MessageFlags.Ephemeral })
        }
    }
}