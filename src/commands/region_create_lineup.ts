import { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../Command";
import { Lineup, Region } from "../utils/mongodb/Models";



export const RegionCreateLineup: Command = {
    name: 'region_create_lineup',
    description: 'You can create lineup for your region',
    run: async (client: Client, interaction: CommandInteraction) => {
        const guildId = interaction.guild?.id || ''
        const region = await Region.findOne({guildId})
        const user = interaction.user.id || ''
        if (!region?.official) {
            await interaction.reply({
                content: 'Only official region admin can create lineup',
                ephemeral: true
            })
            return
        }
        const lineupChannel = interaction.channel?.id || ''
        await Region.findOneAndUpdate({
            guildId
        }, {$set: {
            lineupChannel: lineupChannel
        }})
        const tempLineup = await Lineup.findOne({guildId})
        if (!tempLineup) {
            await Lineup.create({
                guildId,
                attackers: [],
                midfielders: [],
                defenders: [],
                goalkeepers: []
            })
        }
        const lineup = await Lineup.findOne({guildId})
        if (!lineup) {
            await interaction.reply({
                content: 'Lineup has not found',
                ephemeral: true
            })
            return
        }
        const totalPlayers = lineup.attackers.length + lineup.midfielders.length + lineup.defenders.length + lineup.goalkeepers.length
        const embed = new EmbedBuilder()
        embed.setTitle('Matchmaking')
        embed.setColor('Red')
        embed.setDescription(`${region.regionName} matchmaking lineup`)
        embed.addFields(
            {name: 'Queue', value: `${totalPlayers} players waiting for queue`},
            {name: 'Attackers', value: `${lineup.attackers.length}`},
            {name: 'Midfielders', value: `${lineup.midfielders.length}`},
            {name: 'Defenders', value: `${lineup.defenders.length}`},
            {name: 'Goalkeepers', value: `${lineup.goalkeepers.length}`}
        )
        embed.setFooter(
            {text: `${region.regionName}`, iconURL: client.guilds.cache.get(region.guildId)?.iconURL() || ''}
        )
        const row = new ActionRowBuilder<ButtonBuilder>()
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(`join_as_attacker_${lineup._id.toString()}`)
                .setLabel('Join as Attacker')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(lineup.attackers.includes(user)? true: false),
            new ButtonBuilder()
                .setCustomId(`join_as_midfielder_${lineup._id.toString()}`)
                .setLabel('Join as Midfielder')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(lineup.midfielders.includes(user)? true: false),
            new ButtonBuilder()
                .setCustomId(`join_as_defender_${lineup._id.toString()}`)
                .setLabel('Join as Defender')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(lineup.defenders.includes(user)? true: false),
            new ButtonBuilder()
                .setCustomId(`join_as_goalkeeper_${lineup._id.toString()}`)
                .setLabel('Join as Goalkeeper')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(lineup.goalkeepers.includes(user)? true: false),
            new ButtonBuilder()
                .setCustomId('leave_queue')
                .setLabel('Leave')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(lineup.attackers.includes(user)? false : lineup.midfielders.includes(user)? false : lineup.defenders.includes(user)? false : lineup.goalkeepers.includes(user)? false : true)
        )
        const textChannel = client.channels.cache.get(region.lineupChannel || '')
        if (textChannel?.isTextBased()) {
            textChannel.send({
                embeds: [embed],
                components: [row]
            })
            await interaction.reply({
                content: 'Lineup has been created',
                ephemeral: true
            })
        }else {
            await interaction.reply({
                content: 'Lineup can not created. Lineup can create at text-channels.',
                ephemeral: true
            })
        }
    }
}