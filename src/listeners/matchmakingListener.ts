import { Lineup } from "../utils/mongodb/Models";
import { lineupType } from "typings";
import { Client, ColorResolvable, EmbedBuilder } from "discord.js";
import { ObjectId } from "mongodb";
import { Status } from "../commands/status";

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
    if (document.type == 'solo') {
        await soloBronzeCheck({document, client})
        await soloSilverCheck({document, client})
        await soloGoldCheck({document, client})
    }
}

async function soloBronzeCheck({document, client}: {document: lineupType, client: Client}) {
    if ( !document.ranked?.bronze.attackers ) return
    if ( !document.ranked?.bronze.midfielders ) return
    if ( !document.ranked?.bronze.defenders ) return
    if ( !document.ranked?.bronze.goalkeepers ) return
    if (document.ranked.bronze.attackers.length < 6 ) return
    if (document.ranked.bronze.midfielders.length < 2 ) return
    if (document.ranked.bronze.defenders.length < 6 ) return
    if (document.ranked.bronze.goalkeepers.length < 2 ) return
    let lobbyNumber = Math.floor(Math.random() * 9999)
    let lobbyName = `PSL Lobby ${lobbyNumber.toString()}`
    let lobbyPassword = Math.floor(Math.random() * 9999) + 1000
    let matchId: string = (Math.floor(Math.random() * 999999) + 100000).toString()
    let lobbyHoster: string = ''
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

    let attackers = document.ranked.bronze.attackers
    let attackerCount = attackers.length
    let attacker = Math.floor(Math.random() * attackerCount)

    let midfielders = document.ranked.bronze.midfielders
    let midfielderCount = midfielders.length
    let midfielder = Math.floor(Math.random() * midfielderCount)

    let defenders = document.ranked.bronze.defenders
    let defenderCount = defenders.length
    let defender = Math.floor(Math.random() * defenderCount)

    let goalkeepers = document.ranked.bronze.goalkeepers
    let goalkeeperCount = goalkeepers.length
    let goalkeeper = Math.floor(Math.random() * goalkeeperCount)

    // random for red team attackers
    attacker = Math.floor(Math.random() * attackerCount)
    redLw = attackers[attacker]
    lobbyHoster = redLw
    sendMessage({client, userId: redLw, userPosition: 'lw', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    attackers.splice(attacker, 1)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    redCf = attackers[attacker]
    sendMessage({client, userId: redCf, userPosition: 'cf', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    attackers.splice(attacker, 1)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    redRw = attackers[attacker]
    sendMessage({client, userId: redRw, userPosition: 'rw', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    attackers.splice(attacker, 1)

    //random for red team midfielder
    midfielder = Math.floor(Math.random() * midfielderCount)
    redCm = midfielders[midfielder]
    sendMessage({client, userId: redCm, userPosition: 'cm', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    midfielders.splice(midfielder, 1)

    //random for red team defenders
    defender = Math.floor(Math.random() * defenderCount)
    redLb = defenders[defender]
    sendMessage({client, userId: redLb, userPosition: 'lb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    redCb = defenders[defender]
    sendMessage({client, userId: redCb, userPosition: 'cb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    redRb = defenders[defender]
    sendMessage({client, userId: redRb, userPosition: 'rb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    defenders.splice(defender, 1)

    //random for red team goalkeeper
    goalkeeper = Math.floor(Math.random() * goalkeeperCount)
    redGk = goalkeepers[goalkeeper]
    sendMessage({client, userId: redGk, userPosition: 'gk', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    goalkeepers.splice(goalkeeper, 1)

    //random for blue team attackers
    attacker = Math.floor(Math.random() * attackerCount)
    blueLw = attackers[attacker]
    sendMessage({client, userId: blueLw, userPosition: 'lw', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    attackers.splice(attacker, 1)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    blueCf = attackers[attacker]
    sendMessage({client, userId: blueCf, userPosition: 'cf', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    attackers.splice(attacker, 1)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    blueRw = attackers[attacker]
    sendMessage({client, userId: blueRw, userPosition: 'rw', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    attackers.filter((a) => a != blueRw)
    attackers.splice(attacker, 1)

    //random for blue team midfielder
    midfielder = Math.floor(Math.random() * midfielderCount)
    blueCm = midfielders[midfielder]
    sendMessage({client, userId: blueCm, userPosition: 'cm', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    midfielders.splice(midfielder, 1)

    //random for blue team defenders
    defender = Math.floor(Math.random() * defenderCount)
    blueLb = defenders[defender]
    sendMessage({client, userId: blueLb, userPosition: 'lb', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    blueCb = defenders[defender]
    sendMessage({client, userId: blueCb, userPosition: 'cb', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    blueRb = defenders[defender]
    sendMessage({client, userId: blueRb, userPosition: 'rb', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    
    //random for blue team goalkeeper
    goalkeeper = Math.floor(Math.random() * goalkeeperCount)
    blueGk = goalkeepers[goalkeeper]
    sendMessage({client, userId: blueGk, userPosition: 'gk', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    goalkeepers.splice(goalkeeper, 1)


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

async function soloSilverCheck({document, client}: {document: lineupType, client: Client}) {
    if ( !document.ranked?.silver.attackers ) return
    if ( !document.ranked?.silver.midfielders ) return
    if ( !document.ranked?.silver.defenders ) return
    if ( !document.ranked?.silver.goalkeepers ) return
    if (document.ranked.silver.attackers.length < 6 ) return
    if (document.ranked.silver.midfielders.length < 2 ) return
    if (document.ranked.silver.defenders.length < 6 ) return
    if (document.ranked.silver.goalkeepers.length < 2 ) return
    let lobbyNumber = Math.floor(Math.random() * 9999)
    let lobbyName = `PSL Lobby ${lobbyNumber.toString()}`
    let lobbyPassword = Math.floor(Math.random() * 9999) + 1000
    let matchId: string = (Math.floor(Math.random() * 999999) + 100000).toString()
    let lobbyHoster: string = ''
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

    let attackers = document.ranked.silver.attackers
    let attackerCount = attackers.length
    let attacker = Math.floor(Math.random() * attackerCount)

    let midfielders = document.ranked.silver.midfielders
    let midfielderCount = midfielders.length
    let midfielder = Math.floor(Math.random() * midfielderCount)

    let defenders = document.ranked.silver.defenders
    let defenderCount = defenders.length
    let defender = Math.floor(Math.random() * defenderCount)

    let goalkeepers = document.ranked.silver.goalkeepers
    let goalkeeperCount = goalkeepers.length
    let goalkeeper = Math.floor(Math.random() * goalkeeperCount)

    // random for red team attackers
    attacker = Math.floor(Math.random() * attackerCount)
    redLw = attackers[attacker]
    lobbyHoster = redLw
    sendMessage({client, userId: redLw, userPosition: 'lw', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    attackers.splice(attacker, 1)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    redCf = attackers[attacker]
    sendMessage({client, userId: redCf, userPosition: 'cf', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    attackers.splice(attacker, 1)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    redRw = attackers[attacker]
    sendMessage({client, userId: redRw, userPosition: 'rw', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    attackers.splice(attacker, 1)

    //random for red team midfielder
    midfielder = Math.floor(Math.random() * midfielderCount)
    redCm = midfielders[midfielder]
    sendMessage({client, userId: redCm, userPosition: 'cm', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    midfielders.splice(midfielder, 1)

    //random for red team defenders
    defender = Math.floor(Math.random() * defenderCount)
    redLb = defenders[defender]
    sendMessage({client, userId: redLb, userPosition: 'lb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    redCb = defenders[defender]
    sendMessage({client, userId: redCb, userPosition: 'cb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    redRb = defenders[defender]
    sendMessage({client, userId: redRb, userPosition: 'rb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    defenders.splice(defender, 1)

    //random for red team goalkeeper
    goalkeeper = Math.floor(Math.random() * goalkeeperCount)
    redGk = goalkeepers[goalkeeper]
    sendMessage({client, userId: redGk, userPosition: 'gk', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    goalkeepers.splice(goalkeeper, 1)

    //random for blue team attackers
    attacker = Math.floor(Math.random() * attackerCount)
    blueLw = attackers[attacker]
    sendMessage({client, userId: blueLw, userPosition: 'lw', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    attackers.splice(attacker, 1)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    blueCf = attackers[attacker]
    sendMessage({client, userId: blueCf, userPosition: 'cf', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    attackers.splice(attacker, 1)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    blueRw = attackers[attacker]
    sendMessage({client, userId: blueRw, userPosition: 'rw', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    attackers.filter((a) => a != blueRw)
    attackers.splice(attacker, 1)

    //random for blue team midfielder
    midfielder = Math.floor(Math.random() * midfielderCount)
    blueCm = midfielders[midfielder]
    sendMessage({client, userId: blueCm, userPosition: 'cm', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    midfielders.splice(midfielder, 1)

    //random for blue team defenders
    defender = Math.floor(Math.random() * defenderCount)
    blueLb = defenders[defender]
    sendMessage({client, userId: blueLb, userPosition: 'lb', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    blueCb = defenders[defender]
    sendMessage({client, userId: blueCb, userPosition: 'cb', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    blueRb = defenders[defender]
    sendMessage({client, userId: blueRb, userPosition: 'rb', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    
    //random for blue team goalkeeper
    goalkeeper = Math.floor(Math.random() * goalkeeperCount)
    blueGk = goalkeepers[goalkeeper]
    sendMessage({client, userId: blueGk, userPosition: 'gk', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    goalkeepers.splice(goalkeeper, 1)


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


async function soloGoldCheck({document, client}: {document: lineupType, client: Client}) {
    if ( !document.ranked?.gold.attackers ) return
    if ( !document.ranked?.gold.midfielders ) return
    if ( !document.ranked?.gold.defenders ) return
    if ( !document.ranked?.gold.goalkeepers ) return
    if (document.ranked.gold.attackers.length < 6 ) return
    if (document.ranked.gold.midfielders.length < 2 ) return
    if (document.ranked.gold.defenders.length < 6 ) return
    if (document.ranked.gold.goalkeepers.length < 2 ) return
    let lobbyNumber = Math.floor(Math.random() * 9999)
    let lobbyName = `PSL Lobby ${lobbyNumber.toString()}`
    let lobbyPassword = Math.floor(Math.random() * 9999) + 1000
    let matchId: string = (Math.floor(Math.random() * 999999) + 100000).toString()
    let lobbyHoster: string = ''
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

    let attackers = document.ranked.gold.attackers
    let attackerCount = attackers.length
    let attacker = Math.floor(Math.random() * attackerCount)

    let midfielders = document.ranked.gold.midfielders
    let midfielderCount = midfielders.length
    let midfielder = Math.floor(Math.random() * midfielderCount)

    let defenders = document.ranked.gold.defenders
    let defenderCount = defenders.length
    let defender = Math.floor(Math.random() * defenderCount)

    let goalkeepers = document.ranked.gold.goalkeepers
    let goalkeeperCount = goalkeepers.length
    let goalkeeper = Math.floor(Math.random() * goalkeeperCount)

    // random for red team attackers
    attacker = Math.floor(Math.random() * attackerCount)
    redLw = attackers[attacker]
    lobbyHoster = redLw
    sendMessage({client, userId: redLw, userPosition: 'lw', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    attackers.splice(attacker, 1)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    redCf = attackers[attacker]
    sendMessage({client, userId: redCf, userPosition: 'cf', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    attackers.splice(attacker, 1)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    redRw = attackers[attacker]
    sendMessage({client, userId: redRw, userPosition: 'rw', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    attackers.splice(attacker, 1)

    //random for red team midfielder
    midfielder = Math.floor(Math.random() * midfielderCount)
    redCm = midfielders[midfielder]
    sendMessage({client, userId: redCm, userPosition: 'cm', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    midfielders.splice(midfielder, 1)

    //random for red team defenders
    defender = Math.floor(Math.random() * defenderCount)
    redLb = defenders[defender]
    sendMessage({client, userId: redLb, userPosition: 'lb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    redCb = defenders[defender]
    sendMessage({client, userId: redCb, userPosition: 'cb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    redRb = defenders[defender]
    sendMessage({client, userId: redRb, userPosition: 'rb', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    defenders.splice(defender, 1)

    //random for red team goalkeeper
    goalkeeper = Math.floor(Math.random() * goalkeeperCount)
    redGk = goalkeepers[goalkeeper]
    sendMessage({client, userId: redGk, userPosition: 'gk', team: 'Red Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Red', lobbyHoster, matchId})
    goalkeepers.splice(goalkeeper, 1)

    //random for blue team attackers
    attacker = Math.floor(Math.random() * attackerCount)
    blueLw = attackers[attacker]
    sendMessage({client, userId: blueLw, userPosition: 'lw', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    attackers.splice(attacker, 1)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    blueCf = attackers[attacker]
    sendMessage({client, userId: blueCf, userPosition: 'cf', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    attackers.splice(attacker, 1)
    attackerCount = attackers.length
    attacker = Math.floor(Math.random() * attackerCount)
    blueRw = attackers[attacker]
    sendMessage({client, userId: blueRw, userPosition: 'rw', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    attackers.filter((a) => a != blueRw)
    attackers.splice(attacker, 1)

    //random for blue team midfielder
    midfielder = Math.floor(Math.random() * midfielderCount)
    blueCm = midfielders[midfielder]
    sendMessage({client, userId: blueCm, userPosition: 'cm', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    midfielders.splice(midfielder, 1)

    //random for blue team defenders
    defender = Math.floor(Math.random() * defenderCount)
    blueLb = defenders[defender]
    sendMessage({client, userId: blueLb, userPosition: 'lb', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    blueCb = defenders[defender]
    sendMessage({client, userId: blueCb, userPosition: 'cb', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    defenderCount = defenders.length
    defender = Math.floor(Math.random() * defenderCount)
    blueRb = defenders[defender]
    sendMessage({client, userId: blueRb, userPosition: 'rb', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    defenders.splice(defender, 1)
    
    //random for blue team goalkeeper
    goalkeeper = Math.floor(Math.random() * goalkeeperCount)
    blueGk = goalkeepers[goalkeeper]
    sendMessage({client, userId: blueGk, userPosition: 'gk', team: 'Blue Team', lobbyName, lobbyPassword: lobbyPassword.toString(), embedColor: 'Blue', lobbyHoster, matchId})
    goalkeepers.splice(goalkeeper, 1)


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


async function sendMessage({client, userId, userPosition, team, lobbyName, lobbyPassword, embedColor, lobbyHoster, matchId}: {client: Client, userId: string, userPosition: string, team: string, lobbyName: string, lobbyPassword: string, embedColor: ColorResolvable, lobbyHoster: string, matchId: string}) {
    const embed = new EmbedBuilder()
    embed.setTitle('Match found')
    embed.setColor(embedColor)
    embed.setThumbnail(client.users.cache.get(userId)?.avatarURL() || null)
    embed.addFields(
        {name: 'Match ID', value: matchId},
        {name: 'Your Position', value: userPosition.toUpperCase()},
        {name: 'Your Team', value: team},
        {name: 'Lobby Hoster', value: `<@${lobbyHoster}>`},
        {name: 'Lobby Name', value: lobbyName},
        {name: 'Lobby Password', value: lobbyPassword},
    )
    embed.setFooter({text: 'Solo ranked match'})
    client.users.cache.get(userId)?.send({
        embeds: [embed]
    })
}


async function removeFromQueue({lineupId, attackers, midfielders, defenders, goalkeepers}: {lineupId: string ,attackers: string[], midfielders: string[], defenders: string[], goalkeepers: string[]}) {
    let all = attackers.concat(midfielders, defenders, goalkeepers)
    await Lineup.findOneAndUpdate({_id: new ObjectId(lineupId)}, {
        $pull: {
            attackers: {$in: all},
            midfielders: {$in: all},
            defenders: {$in: all},
            goalkeepers: {$in: all},
            'ranked.bronze.attackers' : {$in: all},
            'ranked.bronze.midfielders': {$in: all},
            'ranked.bronze.defenders': {$in: all},
            'ranked.bronze.goalkeepers': {$in: all},
            'ranked.silver.attackers' : {$in: all},
            'ranked.silver.midfielders': {$in: all},
            'ranked.silver.defenders': {$in: all},
            'ranked.silver.goalkeepers': {$in: all},
            'ranked.gold.attackers' : {$in: all},
            'ranked.gold.midfielders': {$in: all},
            'ranked.gold.defenders': {$in: all},
            'ranked.gold.goalkeepers': {$in: all},
        }
    })

    //here lineup update eklenecek
}