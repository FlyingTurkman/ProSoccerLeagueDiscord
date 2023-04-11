import { Lineup } from "../utils/mongodb/Models";
import { lineupType } from "typings";
import { Client, EmbedBuilder } from "discord.js";

export default async function matchMakingListener(client: Client) {
    const watch = Lineup.watch([], {fullDocument: 'updateLookup', hydrate: true})
    watch.on('change', async (data) => {
        if (data.operationType == 'insert' || data.operationType == 'update') {
            const document = data.fullDocument
            await isPlayable({document, client})
        }
    })
    
}


async function isPlayable({document, client}: {document: lineupType, client: Client}) {
    if ( !document.attackers ) return
    if ( !document.midfielders ) return
    if ( !document.defenders ) return
    if ( !document.goalkeepers ) return
    if (document.attackers.length < 6 ) return
    if (document.midfielders.length < 2 ) return
    if (document.defenders.length < 6 ) return
    if (document.goalkeepers.length < 1 ) return
    let lobbyNumber = Math.floor(Math.random() * 9999)
    let lobbyName = `PSL Lobby ${lobbyNumber.toString()}`
    let lobbyPassword = Math.floor(Math.random() * 9999) + 1000
    let redLw: string = ''
    let redCf: string = ''
    let redRw: string = ''
    let redCm: string = ''
    let redLb: string = ''
    let redCb: string = ''
    let redRb: string = ''
    let redGk: string = ''

    // ramdom for red team attackers
    let attackers = document.attackers
    let attackerCount = document.attackers.length
    let attacker = Math.floor(Math.random() * attackerCount)
    redLw = attackers[attacker]
    sendMessage({client, userId: redLw, userPosition: 'lw', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString()})
    attackers.filter((a) => a == redLw)
    attackers = document.attackers
    attackerCount = document.attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    redCf = attackers[attacker]
    sendMessage({client, userId: redCf, userPosition: 'cf', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString()})
    attackers.filter((a) => a == redCf)
    attackers = document.attackers
    attackerCount = document.attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    redRw = attackers[attacker]
    sendMessage({client, userId: redRw, userPosition: 'rw', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString()})
    attackers.filter((a) => a == redRw)

    //random for red team midfielders
    let midfielders = document.midfielders
    let midfielderCount = document.midfielders.length
    let midfielder = Math.floor(Math.random() * midfielderCount)
    redCm = midfielders[midfielder]
    sendMessage({client, userId: redCm, userPosition: 'cm', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString()})
    midfielders.filter((m) => m == redCm)

    //random for red team defenders
    let defenders = document.defenders
    let defenderCount = document.defenders.length
    let defender = Math.floor(Math.random() * defenderCount)
    redLb = defenders[defender]
    sendMessage({client, userId: redLb, userPosition: 'lb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString()})
    defenders.filter((d) => d == redLb)
    defenders = document.defenders
    defenderCount = document.defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    redCb = defenders[defender]
    sendMessage({client, userId: redCb, userPosition: 'cb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString()})
    defenders.filter((d) => d == redCb)
    defenders = document.defenders
    defenderCount = document.defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    redRb = defenders[defender]
    sendMessage({client, userId: redRb, userPosition: 'rb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString()})
}

async function sendMessage({client, userId, userPosition, team, lobbyName, lobbyPassword}: {client: Client, userId: string, userPosition: string, team: string, lobbyName: string, lobbyPassword: string}) {
    const embed = new EmbedBuilder()
    embed.setTitle('Match has been found')
    embed.setColor('Red')
    embed.setThumbnail(client.users.cache.get(userId)?.avatarURL() || null)
    embed.addFields(
        {name: 'Your Position', value: userPosition.toUpperCase()},
        {name: 'Your Team', value: team},
        {name: 'Lobby Name', value: lobbyName},
        {name: 'Lobby Password', value: lobbyPassword},
    )
    client.users.cache.get(userId)?.send({
        embeds: [embed]
    })
}