import { HardHat } from "lucide-react";
import { Card } from "../ui/card";

export default function UnderConstruction() {
  return (
    <Card className="p-1 mb-4 flex bg-transparent border-solid border-yellow-400">
      <div className="text-primary flex font-semibold mx-auto">
        <HardHat className="text-gold mr-2"></HardHat>Page under construction
        - please use a desktop browser for best viewing experience!{" "}
        <HardHat className="text-gold ml-2"></HardHat>
      </div>
    </Card>
  );
}
