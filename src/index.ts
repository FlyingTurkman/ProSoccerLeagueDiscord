import { Client } from "discord.js";
import dotenv from 'dotenv'
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import mongoose from "mongoose";
dotenv.config()

console.log("Bot is starting...");

const client = new Client({
    intents: []
});

mongoose.connect(process.env.mongoUri || '', {dbName: 'proSoccerLeague'})
.then(() => {
    console.log('Bağlantı başarıyla kuruldu')
})

ready(client)
interactionCreate(client)


client.login(process.env.botToken)