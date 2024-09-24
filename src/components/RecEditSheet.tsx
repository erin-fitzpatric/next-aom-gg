import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Sheet } from "./ui/sheet";
import { SquarePen } from "lucide-react";
import { Button } from "./ui/button";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import { SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import { Filters } from "@/types/Filters";

interface RecEditProps {
  id: string;
  gameTitle: string;
  gameGuid: string;
  refetchRecs: (filters: Filters) => void;
  filters: Filters;
}

export default function RecEdit({ id, gameTitle, gameGuid, refetchRecs, filters }: RecEditProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState(gameTitle);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleEditGameTitle(fileName: string, gameGuid: string) {
    setIsProcessing(true);
    const response = await fetch(`/api/recordedGames`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ gameTitle: fileName, gameGuid, userId: id }),
    });
    if (response.ok) {
      toast({
        title: "Game Title updated successfully",
        duration: 3000,
      });
      refetchRecs(filters);
    } else if (response.status === 402) {
      toast({
        title: "Wrong user",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error updating the title",
        duration: 3000,
      });
    }
    setIsProcessing(false);
    setIsOpen(false);
  }

  async function handleDeleteGame(gameGuid: string) {
    setIsProcessing(true);
    const response = await fetch(`/api/recordedGames`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ gameGuid, userId: id }),
    });
    if (response.ok) {
      toast({
        title: "Game deleted successfully",
        duration: 3000,
      });
      refetchRecs(filters);
    } else if (response.status === 402) {
      toast({
        title: "Wrong user",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error deleting the game",
        duration: 3000,
      });
    }
    setIsProcessing(false);
    setIsOpen(false);
    setDialogOpen(false);
  }

  return (
    <div className="flex space-x-2">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <SquarePen className="cursor-pointer" />
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
              autoFocus={true}
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
              className="w-full flex justify-center border-b border-gray-400 focus:outline-none focus:border-blue-500 mt-2 px-2 py-2"
            />
          </SheetDescription>
          <Button
            disabled={isProcessing}
            type="submit"
            className="mx-auto mt-4 flex"
            onClick={() => handleEditGameTitle(fileName || "", gameGuid)}
          >
            Confirm
          </Button>
          <SheetTitle>
            <div className="text-center mt-2">Delete this game</div>
          </SheetTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={isProcessing}
                type="submit"
                className="mx-auto mt-4 bg-red-500 hover:bg-red-600 flex"
              >
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/50">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this game? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" disabled={isProcessing} onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={isProcessing}
                  type="submit"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => handleDeleteGame(gameGuid)}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SheetContent>
      </Sheet>
    </div>
  );
}
