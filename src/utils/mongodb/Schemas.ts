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
        {adminId: {
            type: String,
            require: true
        }}
    ],
    regionName: {
        type: String,
        require: true
    },
    reagionLogo: {
        type: String,
        require: true
    }
})