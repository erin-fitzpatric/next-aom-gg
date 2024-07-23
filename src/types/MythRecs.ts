export interface MythRec {
  gameGuid: string;
  playerData: IPlayerData[];
  mapName: string;
  createdAt: Date;
  uploadedBy: string;
  gameTitle: string;
  downloadCount: number;
}

export interface IPlayerData {
  name: string;
  team: number;
  civ: number;
  civList: string;
  rating: number;
  rank?: string;
  powerRating?: string;
  winRatio?: string;
  civWasRandom: boolean;
  color: number;
}