import mongoose from 'mongoose'



const { Schema } = mongoose


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
    lineupChannel: {
        type: String,
        required: true,
        default: ''
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


export const lineupSchema = new Schema({
    guildId: {
        type: String,
        required: true
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