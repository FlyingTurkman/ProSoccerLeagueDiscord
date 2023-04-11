import { Client, Interaction } from "discord.js"

export {}

export type lineupType = {
    guildId: string,
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


declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string,
            mongoUri: string,
            appPath: string
        }
    }
}


