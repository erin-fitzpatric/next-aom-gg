import mongoose, { model } from "mongoose";
import { SocialsSchema } from "../schemas/SocialsSchema";
import { Socials } from "@/types/Socials";

const SocialsModel = mongoose.models.Socials || model<Socials>("Socials", SocialsSchema);

export default SocialsModel;