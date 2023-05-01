import mongoose from 'mongoose'
import { BASE_ELO } from '../src/constants'
import { ObjectId } from 'mongodb'



const { Schema } = mongoose


export const userSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    steamId: {
        type: String,
        required: false
    },
    soloRankedElo: {
        type: Number,
        required: true,
        default: BASE_ELO
    },
    flexRankedElo: {
        type: Number,
        required: true,
        default: BASE_ELO
    },
    stats: {
        soloRanked: {
            win: {type: Number, required: true, default: 0},
            draw: {type: Number, required: true, default: 0},
            lose: {type: Number, required: true, default: 0},
        },
        flexRanked: {
            win: {type: Number, required: true, default: 0},
            draw: {type: Number, required: true, default: 0},
            lose: {type: Number, required: true, default: 0},
        },
        casual: {
            type: Number,
            required: true,
            default: 0
        }
    }
})



export const regionSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    admins: [
        String
    ],
    regionName: {
        type: String,
        required: true
    },
    regionTag: {
        type: String,
        required: true
    },
    reagionLogo: {
        type: String,
        required: true
    },
    official: {
        type: Boolean,
        required: true,
        default: false
    },
    soloRankedLineup: {
        type: String,
        required: false
    },
    flexRankedLineup: {
        type: String,
        required: false
    },
    casualLineup : {
        type: String,
        required: false
    },
    createdAt: {
        type: Number,
        required: true,
        default: new Date().getTime()
    }
})


export const teamSchema = new Schema({
    teamId: {
        type: String,
        requiredd: true
    },
    teamName: {
        type: String,
        requiredd: true
    },
    teamLogo: {
        type: String,
        requiredd: true
    },
    captainId: {
        type: String,
        requiredd: true
    },
    coCaptainId: {
        type: String,
        requiredd: false
    },
    members: [
        String
    ],
    createdAt: {
        type: Number,
        requiredd: true,
        default: new Date().getTime()
    },
    transferChannel: {
        type: String,
        requiredd: false
    },
    customChannel: {
        type: String,
        required: false
    }
})


export const transferOfferSchema = new Schema({
    fromTeam: {
        type: String,
        requiredd: true
    },
    toPlayer: {
        type: String,
        requiredd: true
    },
    accepted: {
        type: Boolean,
        requiredd: true,
        default: false
    },
    rejected: {
        type: Boolean,
        requiredd: true,
        default: false
    },
    dateTime: {
        type: Number,
        requiredd: true,
        default: new Date().getTime()
    }
})



export const customLineupSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    players: [String],
    gk: [String],
    pickStarted: {
        type: Boolean,
        required: true,
        default: false
    },
    timeOut: {
        type: Number,
        required: true,
        default: 120
    }
})





export const lineupSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    ranked: {
        bronze: {
            attackers: [String],
            midfielders: [String],
            defenders: [String],
            goalkeepers: [String],
        },
        silver: {
            attackers: [String],
            midfielders: [String],
            defenders: [String],
            goalkeepers: [String],
        },
        gold: {
            attackers: [String],
            midfielders: [String],
            defenders: [String],
            goalkeepers: [String],
        }
    },
    attackers: [
        String
    ],
    midfielders: [
        String
    ],
    defenders: [
        String
    ],
    goalkeepers: [
        String
    ],
    createdAt: {
        type: Number,
        required: true,
        default: new Date().getTime()
    }
})


export const matchSchema = new Schema({
    matchId: {
        type: String,
        required: true
    },
    matchType: {
        type: String,
        required: true
    },
    redTeam: {
        lw: {
            type: String,
            required: true
        },
        cf: {
            type: String,
            required: true
        },
        rw: {
            type: String,
            required: true
        },
        cm: {
            type: String,
            required: true
        },
        lb: {
            type: String,
            required: true
        },
        cb: {
            type: String,
            required: true
        },
        rb: {
            type: String,
            required: true
        },
        gk: {
            type: String,
            required: true
        }
    },
    blueTeam: {
        lw: {
            type: String,
            required: true
        },
        cf: {
            type: String,
            required: true
        },
        rw: {
            type: String,
            required: true
        },
        cm: {
            type: String,
            required: true
        },
        lb: {
            type: String,
            required: true
        },
        cb: {
            type: String,
            required: true
        },
        rb: {
            type: String,
            required: true
        },
        gk: {
            type: String,
            required: true
        }
    },
    redTeamCaptain: {
        type: String,
        required: true
    },
    blueTeamCaptain: {
        type: String,
        required: true
    },
    lobbyHoster: {
        type: String,
        required: true
    },
    lobbyName: {
        type: String,
        required: true
    },
    lobbyPassword: {
        type: String,
        required: true
    },
    result: {
        type: Number,
        required: true,
        default: 0
    },
    redVote: {
        type: Number,
        required: false
    },
    blueVote: {
        type: Number,
        required: false
    },
    ended: {
        type: Boolean,
        required: true,
        default: false
    },
    dateTime: {
        type: Number,
        required: true,
        default: new Date().getTime()
    }
})