import { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../Command";
import { Region, Lineup } from "../utils/mongodb/Models";

export const Status: Command = {
    name: 'status',
    description: 'Checking lineup status.',
    run: async (client: Client, interaction: CommandInteraction) => {
        const channelId = interaction.channel?.id || ''
        const region = await Region.findOne({lineupChannel: channelId})
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
        const textChannel = client.channels.cache.get(region.lineupChannel || '')
        if (textChannel?.isTextBased()) {
            textChannel.send({
                embeds: [embed],
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