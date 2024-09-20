"use client";

import RecTitle from "./rec-title";
import RecMap from "./rec-map";
import RecFooter from "./rec-footer";
import { useContext, useState } from "react";
import { WindowContext } from "../provider/window-provider";
import { IRecordedGame } from "@/types/RecordedGame";
import { useTeams } from "@/hooks/useTeams";
import { SquarePen, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

interface RecTileProps {
  rec: IRecordedGame;
  showMap?: boolean;
}

export default function RecTile({ rec, showMap = true }: RecTileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const windowSize = useContext(WindowContext);
  const { leftTeams, rightTeams } = useTeams(rec);
  
  async function handleDeleteGame(gameGuid: string) {
    const response = await fetch(`/api/recordedGames`, {
    method: "DELETE",
      headers: {"content-type": "application/json",},body:JSON.stringify({ gameGuid })
    })
    if (response.ok) { 
      toast({
        title: "Game deleted",
        duration: 3000,
      });
    }
    else if (response.status === 404) {
      toast({
        title: "Incorrect game guid",
        duration: 3000,
      });
    } else if (response.status === 500) {
        toast({
          title: "Internal server error",
          duration: 3000,
        });
    } else  {
        toast({
          title: "Unexpected error occurred",
          duration: 3000,
        });
    }
    setIsOpen(false);
  }
  return (
    <div>
      {windowSize && windowSize.width >= 768 ? (
        // desktop layout
        <div>
          <div className="flex">
            <RecTitle gameTitle={rec.gameTitle || ""} />
            <SquarePen className="cursor-pointer"/>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="flex mx-auto" asChild>
                <Trash2 className="cursor-pointer" onClick={() => setIsOpen(true)}/>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-center">Delete Rec Game</SheetTitle>
                </SheetHeader>
                <SheetDescription>
                  <p>Are you sure you want to delete game -&gt; </p>
                  <p>{rec.gameTitle }</p>
                </SheetDescription>
                <Button type="submit" className="flex mx-auto mt-2" onClick={()=>handleDeleteGame(rec.gameGuid)}>
                Confirm
                </Button>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex">
            {leftTeams}
            <div>
              {showMap && <RecMap rec={rec} />}
            </div>
            {rightTeams}
          </div>
          <RecFooter rec={rec} />
        </div>
      ) : (
        // mobile layout
        <div>
          <div className="flex flex-col">
            <div className="flex flex-col items-center">
              <RecTitle gameTitle={rec.gameTitle || ""} />
              {showMap && <RecMap rec={rec} />}
            </div>
            <div className="mx-auto pt-2">
              {leftTeams}
              {rightTeams}
            </div>
          </div>
          <RecFooter rec={rec} />
        </div>
      )}
    </div>
  );
}
