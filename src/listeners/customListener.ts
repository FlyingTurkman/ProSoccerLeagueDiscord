import { ChannelType, Client } from "discord.js";
import { CustomLineup, Team } from "../utils/mongodb/Models";
import { customLineupType } from "typings";
import { ObjectId } from "mongodb";


export default async function customListener(client: Client) {
    const watch = CustomLineup.watch([], {fullDocument: 'updateLookup', hydrate: false})
    watch.on('change', async (data) => {
        if (data.operationType == 'insert' || data.operationType == 'update') {
            const document: customLineupType = data.fullDocument
            await isPlayable({document, client})
        }
    })
}


async function isPlayable({document, client}: {document: customLineupType, client: Client}) {
    const goalkeepers: string[] = document.gk
    const players: string[] = document.players
    if (goalkeepers.length < 1 || players.length < 2) {
        await CustomLineup.updateMany({guildId: document.guildId}, {$set: {pickStarted: false}})
        return
    }
    await CustomLineup.updateMany({guildId: document.guildId}, {$set: {pickStarted: false}})
    const guild = await Team.findOne({teamId: document.guildId})
    if (!guild) {
        return
    }
    const channelId = guild.customChannel || ''
    const channel = client.channels.cache.get(channelId)
    if (!channel || channel.type != ChannelType.GuildText) {
        return
    }
    channel.send({
        content: 'tik tak'
    })
}