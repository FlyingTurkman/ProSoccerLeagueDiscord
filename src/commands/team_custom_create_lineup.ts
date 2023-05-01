import { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from "discord.js";
import { Command } from "../Command";
import { CustomLineup, Lineup, Region, Team } from "../utils/mongodb/Models";
import { NUMBER, ROLE, STRING } from "../utils/src/options";




export const TeamCustomCreateLineup: Command = {
    name: 'team_custom_create_lineup',
    description: 'You can create custom lineup for your team',
    options: [
        {type: ROLE, name: 'captain_role', description: 'Custom Captains', required: false},
        {type: NUMBER, name: 'countdown', description: 'Countdown Seconds', required: false, min_length: 2, max_length: 3}
    ],
    run: async(client: Client, interaction: CommandInteraction) => {
        const guildId = interaction.guildId
        const guild = client.guilds.cache.get(guildId || '')
        const captainRole = interaction.options.get('captain_role')?.value
        const countdown = interaction.options.get('countdown')?.value
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
        if (captainRole) {
            await CustomLineup.findOneAndUpdate({guildId}, {$set: {captainRole}})
        }
        if (countdown) {
            await CustomLineup.findOneAndUpdate({guildId}, {$set: {timeOut: countdown}})
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
        let players: string = '\n'
        newLineup.players.forEach((player: string, i: number) => {
            players = `${players}\n**${i+1}:** ${client.users.cache.get(player)?.username || 'undefined'}`
        })
        embed.setTitle(`${team.teamName} Custom Lineup`)
        embed.setThumbnail(guild.bannerURL())
        embed.addFields({
            name: 'Players', value: players
        })
        embed.addFields(
            { name: '\u200B', value: '\u200B' },
        )
        let goalkeepers: string = '\n'
        newLineup.gk.forEach((player: string, i: number) => {
            goalkeepers = `${goalkeepers}\n**${i+1}:** ${client.users.cache.get(player)?.username || 'undefined'}`
        })
        embed.addFields(
            { name: 'Goalkeepers', value: goalkeepers }
        )
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