const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { color } = require('./../../config/color.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('diceroll')
        .setDescription('Rolls one or more dice with a specified number of sides (max 5 dice, max d100).')
        .addIntegerOption(option =>
                option
                    .setName('sides')
                    .setDescription('The number of sides on the die (e.g., 6 for a standard die)')
                    .setRequired(true)
                    .setMinValue(2)
                    .setMaxValue(100)
        )
        .addIntegerOption(option =>
                option
                    .setName('amount')
                    .setDescription('The number of dice to roll (default: 1, max 5)')
                    .setRequired(false)
                    .setMinValue(1)
                    .setMaxValue(5)
        ),
    usage: '/diceroll <sides> [amount]',
    async execute(interaction, ayumi) {
        const sides = interaction.options.getInteger('sides')
        const amount = interaction.options.getInteger('amount') || 1

        let totalRoll = 0
        const individualRolls = []

        for (let i = 0; i < amount; i++) {
            const roll = Math.floor(Math.random() * sides) + 1
            individualRolls.push(roll)
            totalRoll += roll
        }

        const dicerollEmbed = new EmbedBuilder()
            .setColor(color.default)
            .setTitle('Dice Roll!')
            .setAuthor({
                name: ayumi.user.username,
                iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))

        if (amount === 1) {
            dicerollEmbed.addFields(
                { name: 'Number of Sides', value: `${sides}`, inline: true },
                { name: 'Number of Dice', value: `${amount}`, inline: true },
                { name: 'Result', value: `**${individualRolls[0]}**`, inline: false }
            )
        } else {
            dicerollEmbed.addFields(
                { name: 'Number of Sides', value: `${sides}`, inline: true },
                { name: 'Number of Dice', value: `${amount}`, inline: true },
                { name: 'Individual Rolls', value: individualRolls.join(', '), inline: false },
                { name: 'Total Sum', value: `${totalRoll}`, inline: false }
            )
        }
        
        await interaction.reply({ embeds: [dicerollEmbed] })
    }
}