const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js')

const { color } = require('./../../config/color.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('Information about the Server'),
    async execute(interaction, ayumi) {
        // Owner
        const ownerid = interaction.guild.ownerId
        const owner = ayumi.users.cache.get(ownerid)

        // Members
        const members = await interaction.guild.members.fetch()
        const humans = members.filter(member => !member.user.bot)
        const bots = members.filter(member => member.user.bot)

        // Channels
        const channels = interaction.guild.channels.cache.filter(c => c.type != ChannelType.GuildCategory)
        const textChannels = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText)
        const voiceChannel = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice)

        const serverstatsEmbed = new EmbedBuilder()
            .setColor(color.default)
            .setTitle(`Stats from ${interaction.guild.name}`)
            .setAuthor({
                name: ayumi.user.username,
                iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .setDescription('ServerStats')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 2048 }))
            .addFields(
                { name: 'Owner', value: `${owner.username}` },
                { name: '', value: '' },
                { name: 'All Member', value: `${members.size}`, inline: true },
                { name: 'User', value: `${humans.size}`, inline: true },
                { name: 'Bots', value: `${bots.size}`, inline: true },
                { name: '', value: '' },
                { name: 'All Channel', value: `${channels.size}`, inline: true },
                { name: 'Text Channel', value: `${textChannels.size}`, inline: true },
                { name: 'Voice Channel', value: `${voiceChannel.size}`, inline: true },
            )

        await interaction.reply({ embeds: [serverstatsEmbed] })
    }
}