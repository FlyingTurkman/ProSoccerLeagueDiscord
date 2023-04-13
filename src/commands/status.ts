import { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../Command";
import { Region, Lineup } from "../utils/mongodb/Models";

export const Status: Command = {
    name: 'status',
    description: 'Checking lineup status.',
    run: async (client: Client, interaction: CommandInteraction) => {
        const channelId = interaction.channel?.id || ''
        const region = await Region.findOne({soloRankedLineup: channelId})
        const guildId = interaction.guildId
        if (!region) {
            await interaction.reply({
                content: 'This command is not working here',
                ephemeral: true
            })
            return
        }
        const lineup = await Lineup.findOne({guildId})
        if (!lineup) {
            await interaction.reply({
                content: 'Lineup not found',
                ephemeral: true
            })
            return
        }
        
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
                content: 'Lineup updated',
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