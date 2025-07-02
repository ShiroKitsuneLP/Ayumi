const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js')

const { color } = require('./../../config/color.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The user to ban.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Why are you banning them?')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    usage: '/ban <User> [Reason]',
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
                .setDescription('I couldn\'t find that user in this server.')

            return await interaction.reply({ embeds: [notFoundEmbed], flags: MessageFlags.Ephemeral })
        }

        if(!target.bannable || target.roles.highest.position >= interaction.member.roles.highest.position) {
            const cannotBanEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setTitle('Action Denied')
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription('You can\'t ban this user.\nThey might have a higher role or I lack permissions.')

            return await interaction.reply({ embeds: [cannotBanEmbed], flags: MessageFlags.Ephemeral })
        }

        try {
            const banDmEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setTitle(`You have been banned from the server **${interaction.guild.name}**!`)
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription(`**Reason:** ${reason}`)
            
            await target.send({ embeds: [banDmEmbed] })

            await target.ban({ reason })

            const banEmbed = new EmbedBuilder()
                .setColor(color.success)
                .setTitle('User Banned')
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription(`**${target.user.tag}** has been banned by ${sender}.\n\n**Reason:** ${reason}`)
                .setThumbnail(target.user.displayAvatarURL({ dynamic: true, size: 2048 }))

            await interaction.reply({ embeds: [banEmbed] })
        } catch(err) {
            console.error(err)

            const errorEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setTitle('Ban Failed')
                .setDescription('Something went wrong while trying to ban the user.')

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }
    }
}
