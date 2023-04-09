import mongoose from "mongoose";
import { regionSchema, teamSchema } from "./Schemas";


export const Region = mongoose.model('Region', regionSchema)


export const Team = mongoose.model('Team', teamSchema)