const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js')

const { color } = require('./../../config/color.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The user to kick.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Why are you kicking them?')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction, ayumi) {
        const targetUser = interaction.options.getUser('target')
        const reason = interaction.options.getString('reason') || 'No reason provided.'
        const sender = interaction.user

        const target = await interaction.guild.members.fetch(targetUser.id).catch(() => null)

        if(!target) {
            const notFoundEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setTitle('User not found')
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription('I couldn’t find that user in this server.')

            return await interaction.reply({ embeds: [notFoundEmbed], flags: MessageFlags.Ephemeral })
        }

        if(!target.kickable || target.roles.highest.position >= interaction.member.roles.highest.position) {
            const cannotKickEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setTitle('Action Denied')
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription('You can’t kick this user.\nThey might have a higher role or I lack permissions.')

            return await interaction.reply({ embeds: [cannotKickEmbed], flags: MessageFlags.Ephemeral })
        }

        try {
            await target.kick(reason)

            const kickEmbed = new EmbedBuilder()
                .setColor(color.success)
                .setTitle('User Kicked')
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription(`**${target.user.tag}** has been kicked by ${sender}.\n\n**Reason:** ${reason}`)
                .setThumbnail(target.user.displayAvatarURL({ dynamic: true, size: 2048 }))

            await interaction.reply({ embeds: [kickEmbed] })
        } catch(err) {
            console.error(err)

            const errorEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setTitle('Kick Failed')
                .setDescription('Something went wrong while trying to kick the user.')

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }
    }
}