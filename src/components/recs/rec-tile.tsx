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
  const [action, setAction] = useState<'edit' | 'delete'>('edit');
  const [fileName, setFileName] = useState("");
  const windowSize = useContext(WindowContext);
  const { leftTeams, rightTeams } = useTeams(rec);

  async function handleEditGameTitle(fileName: string, gameGuid: string) {
    const response = await fetch(`/api/recordedGames`, {
      method: "PUT",
      headers: {"content-type": "application/json",},body:JSON.stringify({ gameTitle: fileName, gameGuid })
    })
    if (response.ok) { 
      toast({
        title: "Game Title updated successfully",
        duration: 3000,
      });
    }else if (response.status === 404) {
      toast({
        title: "Incorrect game guid",
        duration: 3000,
      });
    } else if (response.status === 400) {
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
    setFileName("")
    setIsOpen(false);
  }
  
  async function handleDeleteGame(gameGuid: string) {
    const response = await fetch(`/api/recordedGames`, {
    method: "DELETE",
      headers: {"content-type": "application/json",},body:JSON.stringify({ gameGuid })
    })
    if (response.ok) { 
      toast({
        title: "Game deleted successfully",
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
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="flex mx-auto" asChild>
                <SquarePen className="cursor-pointer" onClick={() => {
                  setAction('edit');
                  setIsOpen(true);
                }} />
              </SheetTrigger>
              <SheetTrigger className="flex mx-auto" asChild>
                <Trash2 className="cursor-pointer" onClick={() => {
                  setAction('delete');
                  setIsOpen(true);
                }} />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    {action === 'edit' ? 'Edit Game Title' : 'Delete Rec Game'}
                  </SheetTitle>
                </SheetHeader>
                <SheetDescription>
                  {action === 'edit' ? (
                    <form action="">
                      <input
                        type="text"
                        value={fileName}
                        onChange={(e)=>setFileName(e.target.value)}
                        placeholder="Enter file name"
                        className="border-b border-gray-400 focus:outline-none focus:border-blue-500 px-2 py-2"
                      />
                    </form>
                  ) : (
                    <p>Are you sure you want to delete game? </p>
                  )}
                  {/* <p>{rec.gameTitle}</p> */}
                </SheetDescription>
                <Button 
                  type="submit" 
                  className="flex mx-auto mt-4" 
                  onClick={() => {
                    if (action === 'delete') {
                      handleDeleteGame(rec.gameGuid);
                    } else {
                      handleEditGameTitle(fileName||"",rec.gameGuid);
                    }
                  }}
                >
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
