const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

const { color } = require('./../../config/color.json')
const { hug } = require('./../../config/gif.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug another User.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The user you want to Hug.')
                .setRequired(true)
        ),
    usage: '/hug <User>',
    async execute(interaction, ayumi) {
        const target = interaction.options.getUser('target')
        const sender = interaction.user

        if(target.id === sender.id) {
            const errorHugEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription('Oops! You can\'t hug yourself, silly! \n Try hugging someone else~')

            return await interaction.reply({ embeds: [errorHugEmbed], flags: MessageFlags.Ephemeral })
        }

        const hugMessages = [
            `${sender} wraps ${target} in a warm, cozy hug. \n So comforting!`,
            `A big, soft hug from ${sender} envelops ${target}. \n Feeling loved!`,
            `${target} gets squeezed in a tender embrace by ${sender}. \n What a sweet moment!`,
            `${sender} pulls ${target} into a heartwarming hug, chasing all the blues away. \n So adorable!`,
            `Sharing a tight, loving hug, ${sender} makes ${target} feel all warm and fuzzy inside. \n So precious!`
        ]

        const randomHugMessage = hugMessages[Math.floor(Math.random() * hugMessages.length)]

        const hugGif = hug[Math.floor(Math.random() * hug.length)]

        const hugEmbed = new EmbedBuilder()
            .setColor(color.default)
            .setTitle('A Sweet Hug!')
            .setAuthor({
                name: ayumi.user.username,
                iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .setDescription(randomHugMessage)
            .setImage(hugGif)
        
        await interaction.reply({ embeds: [hugEmbed] })
    }
}