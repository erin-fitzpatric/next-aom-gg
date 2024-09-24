import mongoose, { model } from "mongoose";
import { SocialsSchema } from "../schemas/SocialsSchema";
import { Socials } from "@/types/Socials";

export const SocialsModel = mongoose.models.Socials || model<Socials>("Socials", SocialsSchema);
