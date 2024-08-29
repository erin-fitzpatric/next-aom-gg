import { RecordedGameMetadata } from "./recParser/RecordedGameParser";

export interface IRecordedGame extends RecordedGameMetadata {
  uploadedByUserId: string;
  gameTitle?: string;
  downloadCount: number;
  uploadedBy: string;
  createdAt: Date;
}
