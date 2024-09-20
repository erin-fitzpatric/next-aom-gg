import { Sheet, Trash2 } from "lucide-react";
import { Button } from "./button";
import { SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./sheet";
import { useState } from "react";
import { toast } from "./use-toast";

export default function Delete( gameTitle:string,gameGuid:string ) {
    const [isOpen, setIsOpen] = useState(false);

    async function handleDeleteGame(gameGuid: string) {
        const response = await fetch(`/api/recordedGames`, {
        method: "DELETE",
        headers: {"content-type": "application/json",},body:JSON.stringify({ gameGuid })
        })
        if (response.status === 404) {
            toast({
            title: "Incorrect game guid",
            duration: 3000,
            });
        } else if (response.status === 500) {
            toast({
            title: "Internal server error",
            duration: 3000,
            });
        } else if (response.ok) { 
            toast({
            title: "Game deleted",
            duration: 3000,
            });
            setIsOpen(false);
        } else {
            toast({
            title: "Unexpected error occurred",
            duration: 3000,
            });
        }
    }
    
    return (
        <div>
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
                  <p>{gameTitle }</p>
                </SheetDescription>
                <Button type="submit" className="flex mx-auto mt-2" onClick={()=>handleDeleteGame(gameGuid)}>
                Confirm
                </Button>
              </SheetContent>
            </Sheet>
        </div>
    )
}