import { ChannelType, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
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
        await CustomLineup.updateMany({guildId: document.guildId}, {$set: {countDownStarted: false, pickStarted: false}})
        return
    }
    const guild = await Team.findOne({teamId: document.guildId})
    if (!guild) {
        return
    }
    const channelId = guild.customChannel || ''
    const channel = client.channels.cache.get(channelId)
    if (!channel || channel.type != ChannelType.GuildText) {
        return
    }
    const checkTime = await CustomLineup.findOne({guildId: document.guildId})
    if (!checkTime) return
    if (!checkTime.countDownStarted) {
        const date = new Date()
        date.setSeconds(date.getSeconds() + checkTime.timeOut)
        await CustomLineup.updateMany({guildId: document.guildId}, {$set: {countDownStarted: true, deadLine: date.getTime() || 0}})
        const embed = new EmbedBuilder()
        embed.setFooter({text: `Countdown has begun. Picks will begin at ${date.toUTCString()}. You can join until this time.`})
        embed.setColor('DarkRed')
        channel.send({
            embeds: [embed]
        })
        countDownTick({seconds: 5, guildId: document.guildId, client, captainRole: document.captainRole || ''})
    }
}

async function countDownTick({seconds, guildId, client, captainRole}: {seconds: number, guildId: string, client: Client, captainRole: string}) {
    const interval = setTimeout(async ()=> {
        const guild = await Team.findOne({teamId: guildId})
        if (!guild) return
        const guildDiscord = client.guilds.cache.get(guildId)
        if (!guildDiscord) return
        await CustomLineup.findOneAndUpdate({guildId}, {$set: {pickStarted: true}})
        const lineup = await CustomLineup.findOne({guildId})
        if (!lineup) return
        const playerComponents = []
        const gkComponents = []
        const redPlayers: string[] = []
        const bluePlayers: string[] = []
        let redCaptain: string = ''
        let blueCaptain: string = ''
        let players: string[] = lineup.players
        let gks: string[] = lineup.gk
        
        /* players.forEach((player) => {
            const roleTest = client.guilds.cache.get(guildId)?.roles.cache.get(captainRole)?.members.get(player)
            if (roleTest) {
                if (redCaptain == '') {
                    redCaptain = player
                    redPlayers.push(player)
                }else if (blueCaptain == '') {
                    blueCaptain = player
                    bluePlayers.push(player)
                }
            }
        }) */

        let playersHasCRole: string[] = [];

        function getRandomInt(max: number) {
            return Math.floor(Math.random() * max);
          }

        players.forEach((player) => {
            const roleTest = client.guilds.cache.get(guildId)?.roles.cache.get(captainRole)?.members.get(player)
            if (roleTest) {
                playersHasCRole.push(player);
            }
        })

        let rand = getRandomInt(playersHasCRole.length);
        redCaptain = playersHasCRole[rand];
        redPlayers.push(redCaptain)
        playersHasCRole.splice(rand, 1);
        rand = getRandomInt(playersHasCRole.length);
        blueCaptain = playersHasCRole[rand];
        bluePlayers.push(blueCaptain)

        if (redCaptain == '') {

        }

        if (blueCaptain == '') {

        }

        while(players.length > 0) {
            const rowPlayers = new ActionRowBuilder<ButtonBuilder>()
            players.splice(0, 5).forEach((player) => {
                rowPlayers.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`pick_player_${guildId}_${player}`)
                        .setLabel(`${client.users.cache.get(player)?.username || 'undefined'}`)
                        .setStyle(ButtonStyle.Primary)
                )

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
            { name: '1: ', value: client.users.cache.get(redPlayers[0])?.username || ' ' },
            { name: '2: ', value: client.users.cache.get(redPlayers[1])?.username || ' ' },
            { name: '3: ', value: client.users.cache.get(redPlayers[2])?.username || ' ' },
            { name: '4: ', value: client.users.cache.get(redPlayers[3])?.username || ' ' },
            { name: '5: ', value: client.users.cache.get(redPlayers[4])?.username || ' ' },
            { name: '6: ', value: client.users.cache.get(redPlayers[5])?.username || ' ' },
            { name: '7: ', value: client.users.cache.get(redPlayers[6])?.username || ' ' },
            { name: '8: ', value: client.users.cache.get(redPlayers[7])?.username || ' ' }
        )
        const embedBlue = new EmbedBuilder()
        embedBlue.setTitle('Blue Team')
        embedBlue.setColor('Blue')
        embedBlue.addFields(
            { name: '1: ', value: client.users.cache.get(bluePlayers[0])?.username || ' ' },
            { name: '2: ', value: client.users.cache.get(bluePlayers[1])?.username || ' ' },
            { name: '3: ', value: client.users.cache.get(bluePlayers[2])?.username || ' ' },
            { name: '4: ', value: client.users.cache.get(bluePlayers[3])?.username || ' ' },
            { name: '5: ', value: client.users.cache.get(bluePlayers[4])?.username || ' ' },
            { name: '6: ', value: client.users.cache.get(bluePlayers[5])?.username || ' ' },
            { name: '7: ', value: client.users.cache.get(bluePlayers[6])?.username || ' ' },
            { name: '8: ', value: client.users.cache.get(bluePlayers[7])?.username || ' ' }
        )
        const channel = client.channels.cache.get(guild.customChannel || '')
        if (!channel || channel.type != ChannelType.GuildText) return
        channel.send({
            embeds: [embedRed, embedBlue],
            components: playerComponents
        })
        channel.send({
            components: gkComponents
        })
    }, seconds * 1000)
}