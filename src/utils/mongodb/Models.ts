import mongoose from "mongoose";
import { regionSchema } from "./Schemas";


export const Region = mongoose.model('Region', regionSchema)