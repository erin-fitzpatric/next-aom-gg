import { Schema } from 'mongoose';

export const LeaderboardPlayerSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true, index: true },
    profileUrl: { type: String, required: true },
    country: { type: String, required: true },
    rank: { type: Number, required: true },
    wins: { type: Number, required: true },
    losses: { type: Number, required: true },
    winPercent: { type: Number, required: true },
    totalGames: { type: Number, required: true },
  },
);
