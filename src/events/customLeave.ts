import { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { CustomLineup, Lineup, Region, Team, User } from "../utils/mongodb/Models";
import { buttonInteractionType } from "typings";
import { ObjectId } from "mongodb";


const customId = 'custom_leave_'


export const CustomLeave: buttonInteractionType = {
    customId,
    run: async(client: Client, interaction: Interaction) => {
        if (!interaction.isButton()) return
        const user = interaction.user.id || ''
        const lineupId = interaction.customId.replaceAll(customId, '')
        const lineup = await CustomLineup.findOne({_id: new ObjectId(lineupId)})
        if (!lineup) {
            return
        }
        const update =  await CustomLineup.findOneAndUpdate({_id: new ObjectId(lineupId)}, {
            $pull: {gk: user, players: user}
        })
        if (!update) {
            return
        }
        const team = await Team.findOne({teamId: lineup.guildId})
        if (!team) {
            return
        }
        const channel = client.channels.cache.get(team.customChannel || '')
        if (!channel?.isTextBased()) {
            return
        }
        const guild = client.guilds.cache.get(team.teamId || '')
        if (!guild) {
            return
        }
        const newLineup = await CustomLineup.findOne({_id: new ObjectId(lineupId)})
        if (!newLineup) {
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
                .setCustomId(`custom_join_lineup_${lineup._id.toString()}`)
                .setLabel('Join As Player')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`custom_join_as_goalkeeper_${lineup._id.toString()}`)
                .setLabel('Join as Goalkeeper')
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                .setCustomId(`custom_leave_${lineup._id.toString()}`)
                .setLabel('Leave')
                .setStyle(ButtonStyle.Danger)
        )
        channel.send({
            embeds: [embed],
            components: [row]
        })
        interaction.reply({
            content: 'Succesfully left from lineup',
            ephemeral: true
        })
    }
}