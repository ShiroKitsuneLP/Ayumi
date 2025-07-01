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
    async execute(interaction, ayumi) {
        const target = interaction.options.getUser('target')
        const sender = interaction.user

        if (target.id !== sender.id) {

            const kissGif = kiss[Math.floor(Math.random() * kiss.length)]

            const kissMessages = [
                `${sender} leans in and gives ${target} a tender kiss on the cheek. \n So heartwarming!`,
                `With a soft smile, ${sender} plants a sweet kiss on ${target}. \n What a lovely moment!`,
                `A gentle kiss from ${sender} makes ${target} blush just a little. \n So adorable!`,
                `${sender} shares a loving kiss with ${target}, spreading warmth and affection. \n Feeling fuzzy!`,
                `${target} gets a playful smooch from ${sender}! \n The air is filled with sweetness.`
            ]

            const randomKissMessage = kissMessages[Math.floor(Math.random() * kissMessages.length)]

            const kissEmbed = new EmbedBuilder()
                .setColor(color.default)
                .setTitle('A Sweet Kiss!')
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription(randomKissMessage)
                .setImage(kissGif)
        
            await interaction.reply({ embeds: [kissEmbed] })
        }
        else {
            const errorKissEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription(`Oops! You can’t kiss yourself, silly! \n Try patting someone else~`)

            await interaction.reply({ embeds: [errorKissEmbed], flags: MessageFlags.Ephemeral })
        }
    }
}