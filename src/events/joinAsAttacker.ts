import { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Lineup, Region, User } from "../utils/mongodb/Models";
import { buttonInteractionType } from "typings";
import { ObjectId } from "mongodb";
import { BRONZE, ELO_GAP, SILVER } from "../utils/src/constants";



const customId = 'join_as_attacker_'


export const JoinAsAttacker: buttonInteractionType = {
    customId,
    run: async(client: Client, interaction: Interaction) => {
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

        const userCheck = await User.findOne({userId: user})

        if (!userCheck) {
            User.create({
                userId: user
            })
        }

        const userData = await User.findOne({userId: user})
        if (!userData) {
            await interaction.reply({
                content: 'User not found.',
                ephemeral: true
            })
            return
        }

        if (check.type == 'solo') {
            if (check.ranked?.bronze?.attackers.includes(user) || check.ranked?.silver?.attackers.includes(user) || check.ranked?.gold?.attackers.includes(user)) {
                await interaction.reply({
                    content: 'You are already in lineup as attacker',
                    ephemeral: true
                })
                return
            }
    
            if (userData.soloRankedElo < BRONZE - ELO_GAP) {
                await Lineup.findOneAndUpdate({
                    _id: new ObjectId(lineupId)
                }, {
                    $addToSet: {'ranked.bronze.attackers': user},
                    $pull: {
                        //'ranked.bronze.attackers': user,
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
            }
    
            if (userData.soloRankedElo >= BRONZE - ELO_GAP && userData.soloRankedElo < SILVER - ELO_GAP) {
                await Lineup.findOneAndUpdate({
                    _id: new ObjectId(lineupId)
                }, {
                    $addToSet: {'ranked.bronze.attackers': user, 'ranked.silver.attackers': user},
                    $pull: {
                        //'ranked.bronze.attackers': user,
                        'ranked.bronze.midfielders': user,
                        'ranked.bronze.defenders': user,
                        'ranked.bronze.goalkeepers': user,
                        //'ranked.silver.attackers': user,
                        'ranked.silver.midfielders': user,
                        'ranked.silver.defenders': user,
                        'ranked.silver.goalkeepers': user,
                        'ranked.gold.attackers': user,
                        'ranked.gold.midfielders': user,
                        'ranked.gold.defenders': user,
                        'ranked.gold.goalkeepers': user
                    }
                })
            }
    
            if (userData.soloRankedElo > BRONZE - ELO_GAP && userData.soloRankedElo < SILVER - ELO_GAP) {
                await Lineup.findOneAndUpdate({
                    _id: new ObjectId(lineupId)
                }, {
                    $addToSet: {'ranked.silver.attackers': user},
                    $pull: {
                        'ranked.bronze.attackers': user,
                        'ranked.bronze.midfielders': user,
                        'ranked.bronze.defenders': user,
                        'ranked.bronze.goalkeepers': user,
                        //'ranked.silver.attackers': user,
                        'ranked.silver.midfielders': user,
                        'ranked.silver.defenders': user,
                        'ranked.silver.goalkeepers': user,
                        'ranked.gold.attackers': user,
                        'ranked.gold.midfielders': user,
                        'ranked.gold.defenders': user,
                        'ranked.gold.goalkeepers': user
                    }
                })
            }
    
            if (userData.soloRankedElo >= SILVER - ELO_GAP && userData.soloRankedElo < SILVER) {
                await Lineup.findOneAndUpdate({
                    _id: new ObjectId(lineupId)
                }, {
                    $addToSet: {'ranked.silver.attackers': user, 'ranked.gold.attackers': user},
                    $pull: {
                        'ranked.bronze.attackers': user,
                        'ranked.bronze.midfielders': user,
                        'ranked.bronze.defenders': user,
                        'ranked.bronze.goalkeepers': user,
                        //'ranked.silver.attackers': user,
                        'ranked.silver.midfielders': user,
                        'ranked.silver.defenders': user,
                        'ranked.silver.goalkeepers': user,
                        //'ranked.gold.attackers': user,
                        'ranked.gold.midfielders': user,
                        'ranked.gold.defenders': user,
                        'ranked.gold.goalkeepers': user
                    }
                })
            }
    
            if (userData.soloRankedElo > SILVER && userData.soloRankedElo <= SILVER + ELO_GAP) {
                await Lineup.findOneAndUpdate({
                    _id: new ObjectId(lineupId)
                }, {
                    $addToSet: {'ranked.silver.attackers': user, 'ranked.gold.attackers': user},
                    $pull: {
                        'ranked.bronze.attackers': user,
                        'ranked.bronze.midfielders': user,
                        'ranked.bronze.defenders': user,
                        'ranked.bronze.goalkeepers': user,
                        //'ranked.silver.attackers': user,
                        'ranked.silver.midfielders': user,
                        'ranked.silver.defenders': user,
                        'ranked.silver.goalkeepers': user,
                        //'ranked.gold.attackers': user,
                        'ranked.gold.midfielders': user,
                        'ranked.gold.defenders': user,
                        'ranked.gold.goalkeepers': user
                    }
                })
            }
    
            if (userData.soloRankedElo > SILVER + ELO_GAP) {
                await Lineup.findOneAndUpdate({
                    _id: new ObjectId(lineupId)
                }, {
                    $addToSet: {'ranked.gold.attackers': user},
                    $pull: {
                        'ranked.bronze.attackers': user,
                        'ranked.bronze.midfielders': user,
                        'ranked.bronze.defenders': user,
                        'ranked.bronze.goalkeepers': user,
                        'ranked.silver.attackers': user,
                        'ranked.silver.midfielders': user,
                        'ranked.silver.defenders': user,
                        'ranked.silver.goalkeepers': user,
                        //'ranked.gold.attackers': user,
                        'ranked.gold.midfielders': user,
                        'ranked.gold.defenders': user,
                        'ranked.gold.goalkeepers': user
                    }
                })
            }
    
            const lineup = await Lineup.findOne({_id: new ObjectId(lineupId)})
    
            if (!lineup) {
                await interaction.reply({content: 'Lineup has not exist.', ephemeral: true})
                return
            }
            const newLineup = await Lineup.findOne({guildId})
            if (!newLineup) {
                await interaction.reply({content: 'Lineup has not exist.', ephemeral: true})
                return
            }
    
            const totalBronzePlayers = (lineup?.ranked?.bronze?.attackers.length || 0) + (lineup?.ranked?.bronze?.midfielders.length || 0) + (lineup?.ranked?.bronze?.defenders.length || 0) + (lineup?.ranked?.bronze?.goalkeepers.length || 0)
            const totalSilverPlayers = (lineup?.ranked?.silver?.attackers.length || 0) + (lineup?.ranked?.silver?.midfielders.length || 0) + (lineup?.ranked?.silver?.defenders.length || 0) + (lineup?.ranked?.silver?.goalkeepers.length || 0)
            const totalGoldPlayers = (lineup?.ranked?.gold?.attackers.length || 0) + (lineup?.ranked?.gold?.midfielders.length || 0) + (lineup?.ranked?.gold?.defenders.length || 0) + (lineup?.ranked?.gold?.goalkeepers.length || 0)
    
            const embedBronze = new EmbedBuilder()
            embedBronze.setTitle('Matchmaking')
            embedBronze.setColor('DarkOrange')
            embedBronze.setDescription(`${region.regionName} matchmaking lineup`)
            embedBronze.addFields(
                {name: 'Bronze queue', value: `${totalBronzePlayers} players waiting for queue`, inline: true},
                { name: '\u200B', value: '\u200B' },
                {name: 'Attackers', value: `${lineup.ranked?.bronze?.attackers.length || 0}`, inline: true},
                {name: 'Midfielders', value: `${lineup.ranked?.bronze?.midfielders.length || 0}`, inline: true},
                {name: 'Defenders', value: `${lineup.ranked?.bronze?.defenders.length || 0}`, inline: true},
                {name: 'Goalkeepers', value: `${lineup.ranked?.bronze?.goalkeepers.length || 0}`, inline: true}
            )
            const embedSilver = new EmbedBuilder()
            embedSilver.setTitle('Matchmaking')
            embedSilver.setColor('Grey')
            embedSilver.setDescription(`${region.regionName} matchmaking lineup`)
            embedSilver.addFields(
                {name: 'Silver queue', value: `${totalSilverPlayers} players waiting for queue`, inline: true},
                { name: '\u200B', value: '\u200B' },
                {name: 'Attackers', value: `${lineup.ranked?.silver?.attackers.length || 0}`, inline: true},
                {name: 'Midfielders', value: `${lineup.ranked?.silver?.midfielders.length || 0}`, inline: true},
                {name: 'Defenders', value: `${lineup.ranked?.silver?.defenders.length || 0}`, inline: true},
                {name: 'Goalkeepers', value: `${lineup.ranked?.silver?.goalkeepers.length || 0}`, inline: true}
            )
            const embedGold = new EmbedBuilder()
            embedGold.setTitle('Matchmaking')
            embedGold.setColor('Gold')
            embedGold.setDescription(`${region.regionName} matchmaking lineup`)
            embedGold.addFields(
                {name: 'Gold queue', value: `${totalGoldPlayers} players waiting for queue`, inline: true},
                { name: '\u200B', value: '\u200B' },
                {name: 'Attackers', value: `${lineup.ranked?.gold?.attackers.length || 0}`, inline: true},
                {name: 'Midfielders', value: `${lineup.ranked?.gold?.midfielders.length || 0}`, inline: true},
                {name: 'Defenders', value: `${lineup.ranked?.gold?.defenders.length || 0}`, inline: true},
                {name: 'Goalkeepers', value: `${lineup.ranked?.gold?.goalkeepers.length || 0}`, inline: true}
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
                await interaction.reply({content: 'Succesfully joined.', ephemeral: true})
            }else {
                await interaction.reply({
                    content: 'Lineup can not created. Lineup can create at text-channels.',
                    ephemeral: true
                })
            }
            return
        }
    }
}