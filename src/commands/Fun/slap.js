const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

const { color } = require('./../../config/color.json')
const { slap } = require('./../../config/gif.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slap')
        .setDescription('Slap another User.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The user you want to Slap.')
                .setRequired(true)
        ),
    usage: '/slap <User>',
    async execute(interaction, ayumi) {
        const target = interaction.options.getUser('target')
        const sender = interaction.user

        if(target.id === sender.id) {
            const errorSlapEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription('Oops! You can\'t slap yourself, silly! \n Try slapping someone else~')

            return await interaction.reply({ embeds: [errorSlapEmbed], flags: MessageFlags.Ephemeral })
        }

        const slapMessages = [
            `${sender} playfully slaps ${target}~ \n That must've stung… just a little!`,
            `${target} got a surprise slap from ${sender}! \n Ouchie, but still kinda cute!`,
            `${sender} gives ${target} a light slap on the cheek. \n Just teasing~`,
            `${sender} slaps ${target} with a plushie! \n Soft and dramatic!`,
            `Watch out! ${sender} delivers a dramatic slap to ${target}~ \n Pure anime energy!`
        ]


        const randomSlapMessage = slapMessages[Math.floor(Math.random() * slapMessages.length)]

        const slapGif = slap[Math.floor(Math.random() * slap.length)]

        const slapEmbed = new EmbedBuilder()
            .setColor(color.default)
            .setTitle('A Gentle Slap!')
            .setAuthor({
                name: ayumi.user.username,
                iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .setDescription(randomSlapMessage)
            .setImage(slapGif)
        
        await interaction.reply({ embeds: [slapEmbed] })
    }
}