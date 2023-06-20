import { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from "discord.js";
import { CustomLineup, Lineup, Region, Team, User } from "../utils/mongodb/Models";
import { buttonInteractionType } from "typings";
import { ObjectId } from "mongodb";
import { BRONZE, ELO_GAP, SILVER } from "../utils/src/constants";



const customId = 'pick_player_'



export const PickPlayer: buttonInteractionType = {
    customId,
    run: async (client: Client, interaction: Interaction) => {
        if (!interaction.isButton()) return
        const query = interaction.customId.replaceAll(customId, '')
        const queryArray = query.split('_')
        const guildId = queryArray[0]
        const player = queryArray[1]
        const captain = interaction.user.id
        if (!guildId || !player) {
            interaction.reply({
                content: 'This lineup no more exist.',
                ephemeral: true
            })
            return
        }
        const guild = client.guilds.cache.get(guildId)
        if (!guild) {
            interaction.reply({
                content: 'This guild no more exist.',
                ephemeral: true
            })
            return
        }
        const team = await Team.findOne({teamId: guildId})
        if (!team) {
            interaction.reply({
                content: 'This team no more exist.',
                ephemeral: true
            })
            return
        }
        const lineup = await CustomLineup.findOne({guildId})
        if (!lineup) {
            interaction.reply({
                content: 'Lineup not found.',
                ephemeral: true
            })
            return
        }
        if (lineup.redCaptain != captain && lineup.blueCaptain != captain) {
            interaction.reply({
                content: 'Only captains can pick.',
                ephemeral: true
            })
            return
        }
        const channelId = team.customChannel || ''
        const channel = client.channels.cache.get(channelId)
        if (!channel || channel.type != ChannelType.GuildText) {
            return
        }
        const faze: number = lineup.faze
        const redCaptain: string = lineup.redCaptain || ''
        const blueCaptain: string = lineup.blueCaptain || ''
        const redGk: string = lineup.redGk || ''
        const blueGk: string = lineup.blueGk || ''
        const redPlayers: string[] = lineup.redTeam
        const bluePlayers: string[] = lineup.blueTeam
        const currentPlayers: string[] = redPlayers.concat(bluePlayers)
        const gks: string[] = lineup.gk
        const playerComponents = []
        const gkComponents = []
        if (currentPlayers.includes(player)) {
            interaction.reply({
                content: 'Player already picked',
                ephemeral: true
            })
            return
        }
        const allPlayers: string[] = lineup.players
        const notPicked: string[] = allPlayers.filter((player) => !currentPlayers.includes(player))
        if (faze == 0) {
            //faze 0
            if (captain != redCaptain) {
                interaction.reply({
                    content: 'It is not your turn',
                    ephemeral: true
                })
                return
            }
            await CustomLineup.findOneAndUpdate({guildId}, {
                $addToSet: {
                    redTeam: player
                },
                $set: {
                    faze: 1
                }
            })
            redPlayers.push(player)
            allPlayers.filter((players) => players == player)
            while(notPicked.length > 0) {
                const rowPlayers = new ActionRowBuilder<ButtonBuilder>()
                notPicked.splice(0,5).forEach((player) => {
                    if (!redPlayers.includes(player) && !bluePlayers.includes(player)) {
                        rowPlayers.addComponents(
                            new ButtonBuilder()
                                .setCustomId(`pick_player_${guildId}_${player}`)
                                .setLabel(`${client.users.cache.get(player)?.username || 'undefined'}`)
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(redPlayers.includes(player)? true: bluePlayers.includes(player)? true : false)
                        )
                    }
                })
                playerComponents.push(rowPlayers)
            }
            while (gks.length > 0) {
                const rowGk = new ActionRowBuilder<ButtonBuilder>()
                gks.splice(0,5).forEach((player) => {
                    rowGk.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`pick_player_${guildId}_${player}`)
                            .setLabel(`${client.users.cache.get(player)?.username || 'undefined'}`)
                            .setStyle(ButtonStyle.Success)
                    )
                })
                gkComponents.push(rowGk)
            }
            const embedRed = new EmbedBuilder()
            embedRed.setTitle('Red Team')
            embedRed.setColor('Red')
            embedRed.addFields(
                { name: '1 (C): ', value: client.users.cache.get(redPlayers[0])?.username || ' ' },
                { name: '2: ', value: client.users.cache.get(redPlayers[1])?.username || ' ' },
                { name: '3: ', value: client.users.cache.get(redPlayers[2])?.username || ' ' },
                { name: '4: ', value: client.users.cache.get(redPlayers[3])?.username || ' ' },
                { name: '5: ', value: client.users.cache.get(redPlayers[4])?.username || ' ' },
                { name: '6: ', value: client.users.cache.get(redPlayers[5])?.username || ' ' },
                { name: '7: ', value: client.users.cache.get(redPlayers[6])?.username || ' ' },
                { name: 'GK: ', value: client.users.cache.get(redGk)?.username || ' ' }
            )
            const embedBlue = new EmbedBuilder()
            embedBlue.setTitle('Blue Team')
            embedBlue.setColor('Blue')
            embedBlue.addFields(
                { name: '1 (C): ', value: client.users.cache.get(bluePlayers[0])?.username || ' ' },
                { name: '2: ', value: client.users.cache.get(bluePlayers[1])?.username || ' ' },
                { name: '3: ', value: client.users.cache.get(bluePlayers[2])?.username || ' ' },
                { name: '4: ', value: client.users.cache.get(bluePlayers[3])?.username || ' ' },
                { name: '5: ', value: client.users.cache.get(bluePlayers[4])?.username || ' ' },
                { name: '6: ', value: client.users.cache.get(bluePlayers[5])?.username || ' ' },
                { name: '7: ', value: client.users.cache.get(bluePlayers[6])?.username || ' ' },
                { name: 'GK: ', value: client.users.cache.get(blueGk)?.username || ' ' }
            )
            if (playerComponents.length > 0) {
                channel.send({
                    embeds: [embedRed, embedBlue],
                    components: playerComponents
                })
            }
            if (gkComponents.length > 0) {
                channel.send({
                    components: gkComponents
                })
            }
        } else if (faze == 1) {
            //faze 1
            if (captain != blueCaptain) {
                interaction.reply({
                    content: 'It is not your turn',
                    ephemeral: true
                })
                return
            }
            await CustomLineup.findOneAndUpdate({guildId}, {
                $addToSet: {
                    redTeam: player
                },
                $set: {
                    faze: 2
                }
            })
            bluePlayers.push(player)
            allPlayers.filter((players) => players == player)
            while(notPicked.length > 0) {
                const rowPlayers = new ActionRowBuilder<ButtonBuilder>()
                notPicked.splice(0,5).forEach((player) => {
                    if (!redPlayers.includes(player) && !bluePlayers.includes(player)) {
                        rowPlayers.addComponents(
                            new ButtonBuilder()
                                .setCustomId(`pick_player_${guildId}_${player}`)
                                .setLabel(`${client.users.cache.get(player)?.username || 'undefined'}`)
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(redPlayers.includes(player)? true: bluePlayers.includes(player)? true : false)
                        )
                    }

                })
                playerComponents.push(rowPlayers)
            }
            while (gks.length > 0) {
                const rowGk = new ActionRowBuilder<ButtonBuilder>()
                gks.splice(0,5).forEach((player) => {
                    rowGk.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`pick_player_${guildId}_${player}`)
                            .setLabel(`${client.users.cache.get(player)?.username || 'undefined'}`)
                            .setStyle(ButtonStyle.Success)
                    )
                })
                gkComponents.push(rowGk)
            }
            const embedRed = new EmbedBuilder()
            embedRed.setTitle('Red Team')
            embedRed.setColor('Red')
            embedRed.addFields(
                { name: '1 (C): ', value: client.users.cache.get(redPlayers[0])?.username || ' ' },
                { name: '2: ', value: client.users.cache.get(redPlayers[1])?.username || ' ' },
                { name: '3: ', value: client.users.cache.get(redPlayers[2])?.username || ' ' },
                { name: '4: ', value: client.users.cache.get(redPlayers[3])?.username || ' ' },
                { name: '5: ', value: client.users.cache.get(redPlayers[4])?.username || ' ' },
                { name: '6: ', value: client.users.cache.get(redPlayers[5])?.username || ' ' },
                { name: '7: ', value: client.users.cache.get(redPlayers[6])?.username || ' ' },
                { name: 'GK: ', value: client.users.cache.get(redGk)?.username || ' ' }
            )
            const embedBlue = new EmbedBuilder()
            embedBlue.setTitle('Blue Team')
            embedBlue.setColor('Blue')
            embedBlue.addFields(
                { name: '1 (C): ', value: client.users.cache.get(bluePlayers[0])?.username || ' ' },
                { name: '2: ', value: client.users.cache.get(bluePlayers[1])?.username || ' ' },
                { name: '3: ', value: client.users.cache.get(bluePlayers[2])?.username || ' ' },
                { name: '4: ', value: client.users.cache.get(bluePlayers[3])?.username || ' ' },
                { name: '5: ', value: client.users.cache.get(bluePlayers[4])?.username || ' ' },
                { name: '6: ', value: client.users.cache.get(bluePlayers[5])?.username || ' ' },
                { name: '7: ', value: client.users.cache.get(bluePlayers[6])?.username || ' ' },
                { name: 'GK: ', value: client.users.cache.get(blueGk)?.username || ' ' }
            )
            if (playerComponents.length > 0) {
                channel.send({
                    embeds: [embedRed, embedBlue],
                    components: playerComponents
                })
            }
            if (gkComponents.length > 0) {
                channel.send({
                    components: gkComponents
                })
            }
        }
        
        else {
            interaction.reply({
                content: 'Tıklama sikik',
                ephemeral: true
            })
        }

    }
}