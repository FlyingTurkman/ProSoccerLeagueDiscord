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
        require: true
    },
    teamName: {
        type: String,
        require: true
    },
    teamLogo: {
        type: String,
        require: true
    },
    captainId: {
        type: String,
        require: true
    },
    coCaptainId: {
        type: String,
        require: false
    },
    members: [
        String
    ],
    createdAt: {
        type: Number,
        require: true,
        default: new Date().getTime()
    }
})