import { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Lineup, Region } from "../utils/mongodb/Models";
import { buttonInteractionType } from "typings";
import { ObjectId } from "mongodb";


const customId = 'join_as_goalkeeper_'


export const JoinAsGoalkeeper: buttonInteractionType = {
    customId,
    run: async (client: Client, interaction: Interaction) => {
        if (!interaction.isButton()) return
        const user = interaction.user.id || ''
        const lineupId = interaction.customId.replaceAll(customId, '')
        const guildId = interaction.guild?.id || ''
        const region = await Region.findOne({guildId})
        if (!region?.official) {
            await interaction.reply({content: 'Only official servers can create lineup.', ephemeral: true})
            return
        }
        const check = await Lineup.findOne({_id: new ObjectId(lineupId)})
        if (!check) {
            await interaction.reply({
                content: 'Lineup not found.',
                ephemeral: true
            })
            return
        }
        if (check.goalkeepers.includes(user)) {
            await interaction.reply({
                content: 'You are already in lineup as goalkeeper',
                ephemeral: true
            })
            return
        }
        const lineup = await Lineup.findOneAndUpdate({
            _id: new ObjectId(lineupId)
        }, {
            $addToSet: {goalkeepers: user},
            $pull: {attackers: user, midfielders: user, defenders: user}
        })
        if (!lineup) {
            await interaction.reply({content: 'Lineup has not exist.', ephemeral: true})
            return
        }
        const newLineup = await Lineup.findOne({guildId})
        if (!newLineup) {
            await interaction.reply({content: 'Lineup has not exist.', ephemeral: true})
            return
        }
        const totalPlayers = newLineup.attackers.length + newLineup.midfielders.length + newLineup.defenders.length + newLineup.goalkeepers.length
        const embed = new EmbedBuilder()
        embed.setTitle('Matchmaking')
        embed.setColor('Red')
        embed.setDescription(`${region.regionName} matchmaking lineup`)
        embed.addFields(
            {name: 'Queue', value: `${totalPlayers} players waiting for queue`},
            {name: 'Attackers', value: `${newLineup.attackers.length}`},
            {name: 'Midfielders', value: `${newLineup.midfielders.length}`},
            {name: 'Defenders', value: `${newLineup.defenders.length}`},
            {name: 'Goalkeepers', value: `${newLineup.goalkeepers.length}`}
        )
        embed.setFooter(
            {text: `${region.regionName}`, iconURL: client.guilds.cache.get(region.guildId)?.iconURL() || ''}
        )
        const row = new ActionRowBuilder<ButtonBuilder>()
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(`join_as_attacker_${newLineup._id.toString()}`)
                .setLabel('Join as Attacker')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`join_as_midfielder_${newLineup._id.toString()}`)
                .setLabel('Join as Midfielder')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`join_as_defender_${newLineup._id.toString()}`)
                .setLabel('Join as Defender')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`join_as_goalkeeper_${newLineup._id.toString()}`)
                .setLabel('Join as Goalkeeper')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`leave_queue_${newLineup._id.toString()}`)
                .setLabel('Leave')
                .setStyle(ButtonStyle.Danger)
        )
        const textChannel = client.channels.cache.get(region.soloRankedLineup || '')
        if (textChannel?.isTextBased()) {
            await textChannel.send({
                embeds: [embed],
                components: [row]
            })
            await interaction.reply({content: 'Succesfully joined.', ephemeral: true})
        }else {
            await interaction.reply({
                content: 'Lineup can not created. Lineup can create at text-channels.',
                ephemeral: true
            })
        }
    }
}