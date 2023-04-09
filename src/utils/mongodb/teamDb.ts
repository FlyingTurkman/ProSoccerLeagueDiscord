import { Team } from "./Models";




export async function checkPlayerInTeam({playerId}: {playerId: string}) {
    const check = await Team.findOne({
        members: {$in: playerId}
    })
    return check
}


export async function checkGuildHasTeam({guildId}: {guildId: string}): Promise<boolean> {
    const check = await Team.findOne({
        teamId: guildId
    })
    if (check){
        return true
    }else {
        return false
    }
}


export async function checkIsPlayerTeamCaptain({playerId}: {playerId: string}): Promise<boolean> {
    const check = await Team.findOne({
        captainId: playerId
    })
    if (check) {
        return true
    }else {
        return false
    }
}

export async function checkIsPlayerTeamCaptainOrCoCaptain({playerId}: {playerId: string}): Promise<boolean | string> {
    const check = await Team.findOne({
        $or: [
            {captainId: playerId},
            {coCaptainId: playerId}
        ]
    })
    if (check) {
        return check.teamId || ''
    }else {
        return false
    }
}

export async function checkIsCoCaptainSameTeam({captainId, coCaptainId}: {captainId: string, coCaptainId: string}): Promise<boolean> {
    const check = await Team.findOne({
        $and: [
            {
                members: { $in: captainId }
            },
            {
                members: { $in: coCaptainId }
            }
        ]
    })
    if (check) {
        return true
    }else {
        return false
    }
}
