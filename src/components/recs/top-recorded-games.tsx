"use client";

import { SpinnerWithText } from "../spinner";
import { Card } from "../ui/card";
import { getMythRecs } from "@/server/controllers/mongo-controller";
import Loading from "../loading";
import { useQuery } from "@/utils/useQuery";
import { useCallback } from "react";
import RecTileCondensed from "@/components/recs/rec-tile-condensed";

export default function TopRecordedGames() {
  // Set state

  const getMythRecsCallback = useCallback(() => getMythRecs(0), []);
  const [{ data: recs, loading: isLoading }, isInitialFetch] = useQuery(
    ["getMythRecs"],
    getMythRecsCallback,
  );

  if (isInitialFetch && isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative">
      {recs && recs.length === 0 && !isInitialFetch ? (
        <div className="flex justify-center mt-4">
          <Card className="p-4 w-full">
            <p className="flex justify-center">No recorded games found!</p>
          </Card>
        </div>
      ) : (
        <Card className="p-4">
          {/* Replay Gallery */}
          <div>
            <div className="flex flex-row flex-wrap justify-center">
              {recs?.map((rec) => (
                <Card
                  key={rec.gameGuid}
                  className="bg-secondary rounded-lg m-1 p-2 flex w-fit"
                >
                  <div>
                    <RecTileCondensed
                      key={`rec-tile-${rec.gameGuid}`}
                      rec={rec}
                    ></RecTileCondensed>
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
      )}
    </div>
  );
}
