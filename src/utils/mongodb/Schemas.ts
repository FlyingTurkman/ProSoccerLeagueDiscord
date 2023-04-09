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
        {adminId: {
            type: String,
            required: true
        }}
    ],
    regionName: {
        type: String,
        required: true
    },
    reagionLogo: {
        type: String,
        required: true
    }
})