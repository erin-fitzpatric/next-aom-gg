import { RecordedGameMetadata } from "./RecordedGameParser";


export interface IRecordedGame extends RecordedGameMetadata {
    uploadedBy: string;
    gameTitle: string;
    downloadCount: number;
  }

  