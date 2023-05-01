import { Client, Interaction } from "discord.js"
import { ObjectId } from "mongodb"
import { InferSchemaType } from "mongoose"
import { customLineupSchema } from "src/utils/mongodb/Schemas"

export {}

export type lineupType = {
    _id: ObjectId | string,
    guildId: string,
    type: string,
    ranked?: {
        bronze: {
            attackers: string[],
            midfielders: string[],
            defenders: string[],
            goalkeepers: string[]
        },
        silver: {
            attackers: string[],
            midfielders: string[],
            defenders: string[],
            goalkeepers: string[]
        },
        gold: {
            attackers: string[],
            midfielders: string[],
            defenders: string[],
            goalkeepers: string[]
        },
    }
    attackers?: string[],
    midfielders?: string[],
    defenders?: string[],
    goalkeepers?: string[],
    createdAt: number
}


export type buttonInteractionType = {
    customId: string,
    run: (client: Client, interaction: Interaction) => void
}


export type customLineupType = InferSchemaType<typeof customLineupSchema>


declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string,
            mongoUri: string,
            appPath: string
        }
    }
}


