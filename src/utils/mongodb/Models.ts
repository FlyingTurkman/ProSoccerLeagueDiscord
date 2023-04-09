import mongoose from "mongoose";
import { regionSchema, teamSchema, transferOfferSchema } from "./Schemas";


export const Region = mongoose.model('Region', regionSchema)

export const Team = mongoose.model('Team', teamSchema)

export const TransferOffer = mongoose.model('Transfer_Offer', transferOfferSchema)