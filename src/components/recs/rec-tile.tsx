import { SquarePen, Trash2 } from "lucide-react";
import RecTitle from "./rec-title";
import RecMap from "./rec-map";
import RecFooter from "./rec-footer";
import { useContext, useState } from "react";
import { WindowContext } from "../provider/window-provider";
import { IRecordedGame } from "@/types/RecordedGame";
import { useTeams } from "@/hooks/useTeams";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

interface RecTileProps {
  id: string;
  rec: IRecordedGame;
  showMap?: boolean;
}

export default function RecTile({ id, rec, showMap = true }: RecTileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState(rec.gameTitle);
  const windowSize = useContext(WindowContext);
  const { leftTeams, rightTeams } = useTeams(rec);

  const recGameAuthor = id === rec.uploadedByUserId;

  async function handleEditGameTitle(fileName: string, gameGuid: string) {
    const response = await fetch(`/api/recordedGames`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ gameTitle: fileName, gameGuid }),
    });
    if (response.ok) {
      toast({
        title: "Game Title updated successfully",
        duration: 3000,
      });
    } else if (response.status === 404) {
      toast({
        title: "Incorrect game guid",
        duration: 3000,
      });
    } else if (response.status === 400) {
      toast({
        title: "Internal server error",
        duration: 3000,
      });
    } else {
      toast({
        title: "Unexpected error occurred",
        duration: 3000,
      });
    }
    setFileName("");
    setIsOpen(false);
  }

  async function handleDeleteGame(gameGuid: string) {
    const response = await fetch(`/api/recordedGames`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ gameGuid }),
    });
    if (response.ok) {
      toast({
        title: "Game deleted successfully",
        duration: 3000,
      });
    } else if (response.status === 404) {
      toast({
        title: "Incorrect game guid",
        duration: 3000,
      });
    } else if (response.status === 500) {
      toast({
        title: "Internal server error",
        duration: 3000,
      });
    } else {
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
            <div className="flex mt-9">
              {leftTeams}
            </div>
            <div>
              <RecTitle gameTitle={rec.gameTitle || ""} />
              {showMap && <RecMap rec={rec} />}
            </div>
            <div className="flex flex-col">
              <div className="flex justify-end mt-2 mr-2">
                {!recGameAuthor && (
              <div className="flex space-x-2">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <SquarePen
                      className="cursor-pointer"
                      onClick={() => {
                        setIsOpen(true);
                      }}
                    />
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>
                        <div className="text-center">Edit Game Title</div>
                      </SheetTitle>
                    </SheetHeader>
                    <SheetDescription>
                        <input
                          type="text"
                          autoFocus="false"
                          value={fileName}
                          onChange={(e) => setFileName(e.target.value)}
                          placeholder="Enter file name"
                          className="w-full flex justify-center border-b border-gray-400 focus:outline-none focus:border-blue-500 mt-2 px-2 py-2"
                        />
                    </SheetDescription>
                    <Button
                      type="submit"
                      className="mx-auto mt-4 flex"
                      onClick={() => {
                          handleEditGameTitle(fileName || "", rec.gameGuid);
                        }
                      }
                    >
                      Confirm
                    </Button>
                    <SheetTitle>
                      <div className="text-center mt-2">Delete this game</div>
                    </SheetTitle>
                    <Button
                      type="submit"
                      className="mx-auto mt-4 bg-red-500 flex"
                      onClick={() => {
                          handleDeleteGame(rec.gameGuid);
                        }
                      }
                    >
                      Delete
                    </Button>
                  </SheetContent>
                </Sheet>
              </div>
            )}
              </div>
                {rightTeams}
            </div>
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