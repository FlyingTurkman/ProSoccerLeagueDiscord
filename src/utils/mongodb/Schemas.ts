import mongoose from 'mongoose'



const { Schema } = mongoose


export const regionSchema = new Schema({
    guildId: {
        type: String,
        require: true
    },
    ownerId: {
        type: String,
        require: true
    },
    admins: [
        String
    ],
    regionName: {
        type: String,
        require: true
    },
    regionTag: {
        type: String,
        require: true
    },
    reagionLogo: {
        type: String,
        require: true
    },
    createdAt: {
        type: Number,
        require: true,
        default: new Date().getTime()
    }
})


export const teamSchema = new Schema({
    teamId: {
        type: String,
        required: true
    },
    teamName: {
        type: String,
        required: true
    },
    teamLogo: {
        type: String,
        required: true
    },
    captainId: {
        type: String,
        required: true
    },
    coCaptainId: {
        type: String,
        required: false
    },
    members: [
        String
    ],
    createdAt: {
        type: Number,
        required: true,
        default: new Date().getTime()
    },
    transferChannel: {
        type: String,
        required: false
    }
})


export const transferOfferSchema = new Schema({
    fromTeam: {
        type: String,
        require: true
    },
    toPlayer: {
        type: String,
        require: true
    },
    accepted: {
        type: Boolean,
        require: true,
        default: false
    },
    rejected: {
        type: Boolean,
        require: true,
        default: false
    },
    dateTime: {
        type: Number,
        require: true,
        default: new Date().getTime()
    }
})