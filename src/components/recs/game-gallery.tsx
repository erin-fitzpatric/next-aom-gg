"use client";

import { Card } from "../ui/card";
import RecTile from "./rec-tile";
import { SpinnerWithText } from "../spinner";

// Game gallery component
export const GameGallery = ({ recs, isLoading, setRecs }) => {
  if (!isLoading && recs.length === 0) {
    return (
      <div className="flex justify-center mt-4">
        <Card className="p-4 w-full">
          <p className="flex justify-center">No recorded games found!</p>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div>
        <div className="flex flex-row flex-wrap justify-center">
          {recs?.map((rec) => (
            <Card
              key={rec.gameGuid}
              className="bg-secondary rounded-lg m-1 p-2 flex w-fit"
            >
              <div>
                <RecTile
                  key={`rec-tile-${rec.gameGuid}`}
                  rec={rec}
                  setRecs={setRecs}
                />
              </div>
            </Card>
          ))}
        </div>
        {isLoading && (
          <div className="flex justify-center mt-4">
            <SpinnerWithText text={"Loading recorded games..."} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default GameGallery;
