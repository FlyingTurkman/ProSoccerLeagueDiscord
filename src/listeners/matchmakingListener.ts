import { Lineup } from "../utils/mongodb/Models";
import { lineupType } from "typings";
import { Client, ColorResolvable, EmbedBuilder } from "discord.js";
import { ObjectId } from "mongodb";

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
    let blueLw: string = ''
    let blueCf: string = ''
    let blueRw: string = ''
    let blueCm: string = ''
    let blueLb: string = ''
    let blueCb: string = ''
    let blueRb: string = ''
    let blueGk: string = ''

    let attackers = document.attackers
    let attackerCount = document.attackers.length
    let attacker = Math.floor(Math.random() * attackerCount)

    let midfielders = document.midfielders
    let midfielderCount = document.midfielders.length
    let midfielder = Math.floor(Math.random() * midfielderCount)

    let defenders = document.defenders
    let defenderCount = document.defenders.length
    let defender = Math.floor(Math.random() * defenderCount)

    let goalkeepers = document.goalkeepers
    let goalkeeperCount = document.goalkeepers.length
    let goalkeeper = Math.floor(Math.random() * goalkeeperCount)

    // ramdom for red team attackers
    redLw = attackers[attacker]
    sendMessage({client, userId: redLw, userPosition: 'lw', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red'})
    attackers.filter((a) => a == redLw)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    redCf = attackers[attacker]
    sendMessage({client, userId: redCf, userPosition: 'cf', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red'})
    attackers.filter((a) => a == redCf)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    redRw = attackers[attacker]
    sendMessage({client, userId: redRw, userPosition: 'rw', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red'})
    attackers.filter((a) => a == redRw)

    //random for red team midfielder
    redCm = midfielders[midfielder]
    sendMessage({client, userId: redCm, userPosition: 'cm', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red'})
    midfielders.filter((m) => m == redCm)

    //random for red team defenders
    redLb = defenders[defender]
    sendMessage({client, userId: redLb, userPosition: 'lb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red'})
    defenders.filter((d) => d == redLb)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    redCb = defenders[defender]
    sendMessage({client, userId: redCb, userPosition: 'cb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red'})
    defenders.filter((d) => d == redCb)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    redRb = defenders[defender]
    sendMessage({client, userId: redRb, userPosition: 'rb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red'})

    //random for red team goalkeeper
    redGk = goalkeepers[goalkeeper]
    sendMessage({client, userId: redGk, userPosition: 'gk', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red'})
    goalkeepers.filter((g) => g == redGk)

    //random for blue team attackers
    blueLw = attackers[attacker]
    sendMessage({client, userId: blueLw, userPosition: 'lw', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue'})
    attackers.filter((a) => a == blueLw)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    blueCf = attackers[attacker]
    sendMessage({client, userId: blueCf, userPosition: 'cf', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue'})
    attackers.filter((a) => a == blueCf)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    blueRw = attackers[attacker]
    sendMessage({client, userId: blueRw, userPosition: 'rw', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue'})
    attackers.filter((a) => a == blueRw)

    //random for blue team midfielder
    blueCm = midfielders[midfielder]
    sendMessage({client, userId: blueCm, userPosition: 'cm', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue'})
    midfielders.filter((m) => m == blueCm)

    //random for blue team defenders
    blueLb = defenders[defender]
    sendMessage({client, userId: blueLb, userPosition: 'lb', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue'})
    defenders.filter((d) => d == blueLb)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    blueCb = defenders[defender]
    sendMessage({client, userId: blueCb, userPosition: 'cb', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue'})
    defenders.filter((d) => d == blueCb)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    blueRb = defenders[defender]
    sendMessage({client, userId: blueRb, userPosition: 'rb', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue'})
    
    //random for blue team goalkeeper
    blueGk = goalkeepers[goalkeeper]
    sendMessage({client, userId: blueGk, userPosition: 'gk', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue'})
    goalkeepers.filter((g) => g == blueGk)


    let currentAttackers = [redLw, redCf, redRw, blueLw, blueCf, blueRw]
    let currentMidfielders = [redCm, blueCm]
    let currentDefenders = [redLb, redCb, redRb, blueLb, blueCb, blueRb]
    let currentGoalkeepers = [redGk, blueGk]
    await removeFromQueue({
        attackers: currentAttackers,
        midfielders: currentMidfielders,
        defenders: currentDefenders,
        goalkeepers: currentGoalkeepers,
        lineupId: document._id.toString()
    })
}

async function sendMessage({client, userId, userPosition, team, lobbyName, lobbyPassword, embedColor}: {client: Client, userId: string, userPosition: string, team: string, lobbyName: string, lobbyPassword: string, embedColor: ColorResolvable}) {
    const embed = new EmbedBuilder()
    embed.setTitle('Match has been found')
    embed.setColor(embedColor)
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

async function removeFromQueue({lineupId, attackers, midfielders, defenders, goalkeepers}: {lineupId: string ,attackers: string[], midfielders: string[], defenders: string[], goalkeepers: string[]}) {
    const res = await Lineup.findOneAndUpdate({_id: new ObjectId(lineupId)}, {
        $pull: {
            attackers: {$in: attackers},
            midfielders: {$in: midfielders},
            defenders: {$in: defenders},
            goalkeepers: {$in: goalkeepers}
        }
    })

    //here lineup eklenecek
}