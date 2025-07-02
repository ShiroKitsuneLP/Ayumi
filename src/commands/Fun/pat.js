const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

const { color } = require('./../../config/color.json')
const { pat } = require('./../../config/gif.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('Pat another User.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The user you want to Pat.')
                .setRequired(true)
        ),
    async execute(interaction, ayumi) {
        const target = interaction.options.getUser('target')
        const sender = interaction.user

        if(target.id !== sender.id) {
            const errorPatEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription(`Oops! You can’t pat yourself, silly! \n Try patting someone else~`)

            return await interaction.reply({ embeds: [errorPatEmbed], flags: MessageFlags.Ephemeral })
        }

        const patMessages = [
            `${sender} gently pats ${target}~ \n So heartwarming!`,
            `${target} receives a sweet pat from ${sender}! \n That makes my heart feel so warm!`,
            `${sender} gives ${target} a soft pat... \n A little moment of tenderness.`,
            `A warm pat from ${sender} for ${target}! \n Simply adorable!`,
            `${sender} lovingly pats ${target}~ \n Feeling all warm and fuzzy!`
        ]

        const randomPatMessage = patMessages[Math.floor(Math.random() * patMessages.length)]

        const patGif = pat[Math.floor(Math.random() * pat.length)]

        const patEmbed = new EmbedBuilder()
            .setColor(color.default)
            .setTitle('A Sweet Pat!')
            .setAuthor({
                name: ayumi.user.username,
                iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .setDescription(randomPatMessage)
            .setImage(patGif)
        
        await interaction.reply({ embeds: [patEmbed] })
    }
}