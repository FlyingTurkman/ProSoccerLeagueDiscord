import { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Lineup, Region } from "../utils/mongodb/Models";
import { buttonInteractionType } from "typings";
import { ObjectId } from "mongodb";


const customId = 'leave_queue_'


export const LeaveQueue: buttonInteractionType = {
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

        if (check.type == 'solo') {
            if (
                !check.ranked?.bronze?.attackers.includes(user) && !check.ranked?.bronze?.midfielders.includes(user) && !check.ranked?.bronze?.defenders.includes(user) && !check.ranked?.bronze?.goalkeepers.includes(user) && 
                !check.ranked?.silver?.attackers.includes(user) && !check.ranked?.silver?.midfielders.includes(user) && !check.ranked?.silver?.defenders.includes(user) && !check.ranked?.silver?.goalkeepers.includes(user) && 
                !check.ranked?.gold?.attackers.includes(user) && !check.ranked?.gold?.midfielders.includes(user) && !check.ranked?.gold?.defenders.includes(user) && !check.ranked?.gold?.goalkeepers.includes(user)
            ) {
                await interaction.reply({
                    content: 'You are not in lineup',
                    ephemeral: true
                })
                return
            }
            const lineup = await Lineup.findOneAndUpdate({
                _id: new ObjectId(lineupId)
            }, {
                $pull: {
                    'ranked.bronze.attackers': user,
                    'ranked.bronze.midfielders': user,
                    'ranked.bronze.defenders': user,
                    'ranked.bronze.goalkeepers': user,
                    'ranked.silver.attackers': user,
                    'ranked.silver.midfielders': user,
                    'ranked.silver.defenders': user,
                    'ranked.silver.goalkeepers': user,
                    'ranked.gold.attackers': user,
                    'ranked.gold.midfielders': user,
                    'ranked.gold.defenders': user,
                    'ranked.gold.goalkeepers': user
                }
            })

            if (!lineup) {
                await interaction.reply({
                    content: 'Lineup not found',
                    ephemeral: true
                })
                return
            }

            const newLineup = await Lineup.findOne({_id: new ObjectId(lineupId)})

            if (!newLineup) {
                await interaction.reply({
                    content: 'Lineup not found',
                    ephemeral: true
                })
                return
            }

            const totalBronzePlayers = (newLineup?.ranked?.bronze?.attackers.length || 0) + (newLineup?.ranked?.bronze?.midfielders.length || 0) + (newLineup?.ranked?.bronze?.defenders.length || 0) + (newLineup?.ranked?.bronze?.goalkeepers.length || 0)
            const totalSilverPlayers = (newLineup?.ranked?.silver?.attackers.length || 0) + (newLineup?.ranked?.silver?.midfielders.length || 0) + (newLineup?.ranked?.silver?.defenders.length || 0) + (newLineup?.ranked?.silver?.goalkeepers.length || 0)
            const totalGoldPlayers = (newLineup?.ranked?.gold?.attackers.length || 0) + (newLineup?.ranked?.gold?.midfielders.length || 0) + (newLineup?.ranked?.gold?.defenders.length || 0) + (newLineup?.ranked?.gold?.goalkeepers.length || 0)
    
            const embedBronze = new EmbedBuilder()
            embedBronze.setTitle('Matchmaking')
            embedBronze.setColor('DarkOrange')
            embedBronze.setDescription(`${region.regionName} matchmaking lineup`)
            embedBronze.addFields(
                {name: 'Bronze queue', value: `${totalBronzePlayers} players waiting for queue`, inline: true},
                { name: '\u200B', value: '\u200B' },
                {name: 'Attackers', value: `${newLineup.ranked?.bronze?.attackers.length || 0}`, inline: true},
                {name: 'Midfielders', value: `${newLineup.ranked?.bronze?.midfielders.length || 0}`, inline: true},
                {name: 'Defenders', value: `${newLineup.ranked?.bronze?.defenders.length || 0}`, inline: true},
                {name: 'Goalkeepers', value: `${newLineup.ranked?.bronze?.goalkeepers.length || 0}`, inline: true}
            )
            const embedSilver = new EmbedBuilder()
            embedSilver.setTitle('Matchmaking')
            embedSilver.setColor('Grey')
            embedSilver.setDescription(`${region.regionName} matchmaking lineup`)
            embedSilver.addFields(
                {name: 'Silver queue', value: `${totalSilverPlayers} players waiting for queue`, inline: true},
                { name: '\u200B', value: '\u200B' },
                {name: 'Attackers', value: `${newLineup.ranked?.silver?.attackers.length || 0}`, inline: true},
                {name: 'Midfielders', value: `${newLineup.ranked?.silver?.midfielders.length || 0}`, inline: true},
                {name: 'Defenders', value: `${newLineup.ranked?.silver?.defenders.length || 0}`, inline: true},
                {name: 'Goalkeepers', value: `${newLineup.ranked?.silver?.goalkeepers.length || 0}`, inline: true}
            )
            const embedGold = new EmbedBuilder()
            embedGold.setTitle('Matchmaking')
            embedGold.setColor('Gold')
            embedGold.setDescription(`${region.regionName} matchmaking lineup`)
            embedGold.addFields(
                {name: 'Gold queue', value: `${totalGoldPlayers} players waiting for queue`, inline: true},
                { name: '\u200B', value: '\u200B' },
                {name: 'Attackers', value: `${newLineup.ranked?.gold?.attackers.length || 0}`, inline: true},
                {name: 'Midfielders', value: `${newLineup.ranked?.gold?.midfielders.length || 0}`, inline: true},
                {name: 'Defenders', value: `${newLineup.ranked?.gold?.defenders.length || 0}`, inline: true},
                {name: 'Goalkeepers', value: `${newLineup.ranked?.gold?.goalkeepers.length || 0}`, inline: true}
            )
            embedGold.setFooter(
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
                    .setStyle(ButtonStyle.Danger),
            )

            const textChannel = client.channels.cache.get(region.soloRankedLineup || '')
            if (textChannel?.isTextBased()) {
                await textChannel.send({
                    embeds: [embedBronze, embedSilver, embedGold],
                    components: [row]
                })
                await interaction.reply({content: 'Succesfully leaved.', ephemeral: true})
            }else {
                await interaction.reply({
                    content: 'Lineup can not created. Lineup can create at text-channels.',
                    ephemeral: true
                })
            }
        }else if (check.type == 'flex') {

        }else if (check.type == 'casual') {

        }
    
    }
}