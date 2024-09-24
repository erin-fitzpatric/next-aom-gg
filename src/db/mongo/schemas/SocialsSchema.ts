import { Schema } from "mongoose";

export const SocialsSchema = new Schema({
    userId: { type: String, required: true },
    twitchUrl: { type: String, default: null },
}, {
    timestamps: true,
});