const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { color } = require('./../../config/color.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin and test your luck!')
        .addStringOption(option =>
            option
                .setName('guess')
                .setDescription('Your guess: heads or tails')
                .setRequired(false)
                .addChoices(
                    { name: 'Heads', value: 'heads' },
                    { name: 'Tails', value: 'tails' }
                )
        ),
    usage: '/coinflip <guess>',
    async execute(interaction, ayumi) {
        const userGuess = interaction.options.getString('guess')

        if(!userGuess) {
            const coinflipInfoEmbed = new EmbedBuilder()
                .setColor(color.default)
                .setTitle('Coin Flip')
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription('Use this command to flip a coin and test your luck!')
                .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .addFields(
                    { name: 'Usage', value: '`/coinflip <guess>`' },
                    { name: 'Options', value: '`heads` or `tails`' }
                )

            return await interaction.reply({ embeds: [coinflipInfoEmbed] })
        }

        const outcomes = ['heads', 'tails']
        const result = outcomes[Math.floor(Math.random() * outcomes.length)]

        const win = userGuess === result
        const responseText = win ? 'You guessed it right!' : 'Oops, wrong guess~'

        const coinflipEmbed = new EmbedBuilder()
            .setColor(color.default)
            .setTitle('Coin Flip!')
            .setAuthor({
                name: ayumi.user.username,
                iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .addFields(
                { name: 'Your Guess', value: `${userGuess}`, inline: true },
                { name: 'Result', value: `${result}`, inline: true },
                { name: 'Result Message', value: responseText }
            )

        await interaction.reply({ embeds: [coinflipEmbed] })
    }
}