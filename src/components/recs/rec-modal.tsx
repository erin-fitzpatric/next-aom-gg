import { majorGodIndexToData } from "@/types/MajorGods";
import { RandomMapData } from "@/types/RandomMap";
import { IRecordedGame } from "@/types/RecordedGame";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@radix-ui/react-dialog";
import React from "react";

interface IRecMapParams {
  rec: IRecordedGame;
  mapData: RandomMapData;
}

function formatGameLength(gameLength: number): string {
  // Round game length to the nearest minute
  const roundedLength = Math.round(gameLength / 60) * 60;

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(roundedLength / 3600);
  const minutes = Math.floor((roundedLength % 3600) / 60);
  const seconds = roundedLength % 60;

  // Format and return as 'HH:MM:SS'
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

const RecModal = ({ rec, mapData }: IRecMapParams) => {
  const { gameLength } = rec;
  const formattedGameLength = formatGameLength(gameLength);
  return (
    <Dialog>
      <div className="flex justify-center">
        <DialogTrigger asChild>
          <button className="btn btn-primary text-primary">Results</button>
        </DialogTrigger>
      </div>
      <DialogContent className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-secondary p-4 rounded-lg shadow-lg w-full sm:w-1/3 relative mx-auto max-w-md">
          <button
            className="absolute top-2 right-2 text-green font-bold text-xl"
            aria-label="Close"
          >
            <DialogClose>X</DialogClose>
          </button>
          <DialogTitle className="text-xl font-bold text-gold">
            Results
          </DialogTitle>
          <div className="flex flex-col">
            <div className="mt-4 flex">
              <p className="font-semibold mr-1">Map:</p>
              <p>{mapData.name}</p>
            </div>
            <div>
              <p className="font-semibold">Players:</p>
              <ul className="list-disc ml-6">
                {rec.playerData.map((player, index) => (
                  <li key={index}>
                    {player.name} - {majorGodIndexToData(player.civ).name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex">
              <p className="font-semibold mr-1">Game Length:</p>
              <p>{formattedGameLength}</p>
            </div>
            <div className="flex">
              <p className="font-semibold mr-1">Result:</p>
              <p>TBD</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecModal;
