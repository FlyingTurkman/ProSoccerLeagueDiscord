import { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../Command";
import { Lineup, Region } from "../utils/mongodb/Models";
import { STRING } from "../utils/src/options";



export const RegionCreateLineup: Command = {
    name: 'region_create_lineup',
    description: 'You can create lineup for your region',
    options: [
        {type: STRING, name: 'type', description: 'Lineup type.', choices: [
            {name: 'Solo Queue', value: 'solo'},
            {name: 'Flex Queue', value: 'flex'},
            {name: 'Casual Queue', value: 'casual'}
        ], required: true}
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        const guildId = interaction.guild?.id || ''
        const region = await Region.findOne({guildId})
        const user = interaction.user.id || ''
        const type = interaction.options.get('type')?.value || ''
        const lineupChannel = interaction.channel?.id || ''
        if (!region) {
            await interaction.reply({
                content: 'Region can not found',
                ephemeral: true
            })
            return
        }
        if (!region?.official) {
            await interaction.reply({
                content: 'Only official region admin can create lineup',
                ephemeral: true
            })
            return
        }
        if (!region.admins.includes(user) || region.ownerId != user) {
            await interaction.reply({
                content: 'Only admins can use this command',
                ephemeral: true
            })
            return
        }

        if ( type == 'solo') {
            await createSoloQueue()
        }else if ( type == 'flex' ) {
            await createFlexQueue()
        }else if (type == 'casual') {
            await createCasualQueue()
        }else {
            interaction.reply({
                content: 'Invalid queue type',
                ephemeral: true
            })
        }

        async function createSoloQueue () {
            const guildId = interaction.guild?.id || ''
            const region = await Region.findOne({guildId})
            if (!region) {
                interaction.reply({
                    content: 'Region not found',
                    ephemeral: true
                })
                return
            }
            await Region.findOneAndUpdate({
                guildId
            }, {$set: {
                soloRankedLineup: lineupChannel
            }})
            const tempLineup = await Lineup.findOne({guildId})
            if (!tempLineup) {
                await Lineup.create({
                    guildId,
                    type,
                    ranked: [
                        {
                            bronze: [
                                {attackers: []},
                                {midfielders: []},
                                {defenders: []},
                                {goalkeepers: []}
                            ],
                            silver: [
                                {attackers: []},
                                {midfielders: []},
                                {defenders: []},
                                {goalkeepers: []}
                            ],
                            gold: [
                                {attackers: []},
                                {midfielders: []},
                                {defenders: []},
                                {goalkeepers: []}
                            ]
                        }
                    ]
                })
            }
            const lineup = await Lineup.findOne({guildId})
            if (!lineup) {
                await interaction.reply({
                    content: 'Lineup not found',
                    ephemeral: true
                })
                return
            }
            //const totalPlayers = lineup.attackers.length + lineup.midfielders.length + lineup.defenders.length + lineup.goalkeepers.length
            const totalBronzePlayers = (lineup.ranked?.bronze?.attackers.length || 0) + (lineup.ranked?.bronze?.midfielders.length || 0) + (lineup.ranked?.bronze?.defenders.length || 0) + (lineup.ranked?.bronze?.goalkeepers.length || 0)
            const totalSilverPlayers = (lineup.ranked?.silver?.attackers.length || 0) + (lineup.ranked?.silver?.midfielders.length || 0) + (lineup.ranked?.silver?.defenders.length || 0) + (lineup.ranked?.silver?.goalkeepers.length || 0)
            const totalGoldPlayers = (lineup.ranked?.gold?.attackers.length || 0) + (lineup.ranked?.gold?.midfielders.length || 0) + (lineup.ranked?.gold?.defenders.length || 0) + (lineup.ranked?.gold?.goalkeepers.length || 0)

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
                    .setCustomId(`join_as_attacker_${lineup._id.toString()}`)
                    .setLabel('Join as Attacker')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`join_as_midfielder_${lineup._id.toString()}`)
                    .setLabel('Join as Midfielder')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`join_as_defender_${lineup._id.toString()}`)
                    .setLabel('Join as Defender')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`join_as_goalkeeper_${lineup._id.toString()}`)
                    .setLabel('Join as Goalkeeper')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`leave_queue_${lineup._id.toString()}`)
                    .setLabel('Leave')
                    .setStyle(ButtonStyle.Danger)
            )
            const textChannel = client.channels.cache.get(region.soloRankedLineup || '')
            if (textChannel?.isTextBased()) {
                textChannel.send({
                    embeds: [embedBronze, embedSilver, embedGold],
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
        
        
        async function createFlexQueue() {
        
        }
        
        
        async function createCasualQueue() {
            
        }
    }
}

