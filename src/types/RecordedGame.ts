import { RecordedGameMetadata } from "./RecordedGameParser";

export interface IRecordedGame extends RecordedGameMetadata {
  uploadedByUserId: string;
  gameTitle?: string;
  downloadCount: number;
  uploadedBy: string;
  createdAt: Date;
  gameLength: number;
  s3Key?: string;
}
