import { Client } from "discord.js";
import * as dotenv from 'dotenv'
import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";
import mongoose from "mongoose";


dotenv.config()

console.log('Bot is starting...')

mongoose.connect(process.env.mongoUri || '', {dbName: 'proSoccerLeague'})
.then(() => {
    console.log('Mongo bağlandı')
})

const client = new Client({
    intents: []
})



ready(client)
interactionCreate(client)

client.login(process.env.botToken)

