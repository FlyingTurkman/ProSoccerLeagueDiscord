import mongoose from "mongoose";
import { lineupSchema, regionSchema, teamSchema, transferOfferSchema, userSchema } from "./Schemas";


export const Region = mongoose.model('Region', regionSchema)

export const Team = mongoose.model('Team', teamSchema)

export const TransferOffer = mongoose.model('Transfer_Offer', transferOfferSchema)

export const Lineup = mongoose.model('lineup', lineupSchema)

export const User = mongoose.model('user', userSchema)