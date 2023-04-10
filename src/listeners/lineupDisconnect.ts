import { BaseInteraction, Client, CommandInteraction, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Lineup, Region } from "../utils/mongodb/Models";
import { ObjectId } from "mongodb";



export default async function lineupDisconnect(client: Client) {
    console.log('working')
    for await (const lineup of Lineup.find()) {
        if (!lineup) return
        const guild = client.guilds.cache.get(lineup.guildId)
        if (!guild) return
        for (const at of lineup.attackers) {
            const guild = await client.guilds.fetch(lineup.guildId)
            const user = await guild.members.fetch(at)
            const status = user.presence?.status
            if (status === 'offline' || status == undefined) {
                removePlayer({lineupId: lineup._id.toString(), playerId: user.id})
                await client.users.cache.get(user.id)?.send({
                    content: `You went offline. You are removed from ${guild.name}'s lineup.`
                })
                await refreshLineup({client, lineup})
            }
        }
        for (const mid of lineup.midfielders) {
            const guild = await client.guilds.fetch(lineup.guildId)
            const user = await guild.members.fetch(mid)
            const status = user.presence?.status
            if (status === 'offline' || status == undefined) {
                removePlayer({lineupId: lineup._id.toString(), playerId: user.id})
                await client.users.cache.get(user.id)?.send({
                    content: `You went offline. You are removed from ${guild.name}'s lineup.`
                })
                await refreshLineup({client, lineup})
            }
        }
        for (const def of lineup.defenders) {
            const guild = await client.guilds.fetch(lineup.guildId)
            const user = await guild.members.fetch(def)
            const status = user.presence?.status
            if (status === 'offline' || status == undefined) {
                removePlayer({lineupId: lineup._id.toString(), playerId: user.id})
                await client.users.cache.get(user.id)?.send({
                    content: `You went offline. You are removed from ${guild.name}'s lineup.`
                })
                await refreshLineup({client, lineup})
            }
        }
        for (const gk of lineup.goalkeepers) {
            const guild = await client.guilds.fetch(lineup.guildId)
            const user = await guild.members.fetch(gk)
            const status = user.presence?.status
            if (status === 'offline' || status == undefined) {
                removePlayer({lineupId: lineup._id.toString(), playerId: user.id})
                await client.users.cache.get(user.id)?.send({
                    content: `You went offline. You are removed from ${guild.name}'s lineup.`
                })
                await refreshLineup({client, lineup})
            }
        }

    }
}


async function removePlayer({lineupId, playerId}: {lineupId: string, playerId: string}) {
    await Lineup.findOneAndUpdate({
        _id: new ObjectId(lineupId)
    }, {
        $pull: {attackers: playerId, midfielders: playerId, defenders: playerId, goalkeepers: playerId}
    })
    console.log('removed')
}


async function refreshLineup({client, lineup}: {client: Client, lineup: any}) {
    const newLineup = await Lineup.findOne({guildId: lineup.guildId})
    if (!newLineup) {
        console.log('Lineup doesnt exist')
        return
    }
    const region = await Region.findOne({guildId: lineup.guildId})
    if (!region) {
        console.log('Region doesnt exist')
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
    const textChannel = client.channels.cache.get(region.lineupChannel || '')
    if (textChannel?.isTextBased()) {
        await textChannel.send({
            content: 'A player went offline',
            embeds: [embed],
            components: [row]
        })
    }
}