import { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from "discord.js";
import { Command } from "../Command";
import { CustomLineup, Lineup, Region, Team } from "../utils/mongodb/Models";
import { STRING } from "../utils/src/options";




export const TeamCustomCreateLineup: Command = {
    name: 'team_custom_create_lineup',
    description: 'You can create custom lineup for your team',
    run: async(client: Client, interaction: CommandInteraction) => {
        const guildId = interaction.guildId
        const guild = client.guilds.cache.get(guildId || '')
        if (!guild){
            return
        }
        const channelId = interaction.channelId
        const team = await Team.findOneAndUpdate({
            teamId: guildId
        }, {
            $set: {
                customChannel: channelId
            }
        })
        if (!team) {
            await interaction.reply({
                content: 'You must create a team for custom lineup.',
                ephemeral: true
            })
            return
        }
        const lineup = await CustomLineup.findOne({guildId})
        if (!lineup) {
            await CustomLineup.create({
                guildId,
                players: []
            })
        }
        const newLineup = await CustomLineup.findOne({guildId})
        if (!newLineup) {
            return
        }
        await interaction.reply({
            content: 'Custom lineup succesfully created',
            ephemeral: true
        })
        const channel = client.channels.cache.get(channelId)
        if (!channel ||  channel.type != ChannelType.GuildText) {
            return
        }
        const embed = new EmbedBuilder()
        embed.setTitle(`${team.teamName} Custom Lineup`)
        embed.setThumbnail(guild.bannerURL())
        embed.addFields({
            name: '#', value: 'Player'
        })
        embed.addFields(
            { name: '\u200B', value: '\u200B' },
        )
        newLineup.players.forEach((player: string, i) => {
            embed.addFields({
                name: `${i+1}:`, value: `${client.users.cache.get(player)?.username || 'undefined'}`
            })
        })
        embed.addFields(
            { name: '#', value: 'Goalkeepers' }
        )
        embed.addFields(
            { name: '\u200B', value: '\u200B' }
        )
        newLineup.gk.forEach((player: string, i: number) => {
            embed.addFields({
                name: `${i+1}:`, value: `${client.users.cache.get(player)?.username || 'undefined'}`
            })
        })
        const row = new ActionRowBuilder<ButtonBuilder>()
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(`custom_join_lineup_${newLineup._id.toString()}`)
                .setLabel('Join As Player')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`custom_join_as_goalkeeper_${newLineup._id.toString()}`)
                .setLabel('Join as Goalkeeper')
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                .setCustomId(`custom_leave_${newLineup._id.toString()}`)
                .setLabel('Leave')
                .setStyle(ButtonStyle.Danger)
        )
        channel.send({
            embeds: [embed],
            components: [row]
        })
    }
}