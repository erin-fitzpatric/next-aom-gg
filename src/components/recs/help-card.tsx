"use client";

import { Card } from "../ui/card";

// Help text component
export const HelpCard = () => (
  <Card className="p-4 w-full bg-secondary flex flex-col items-center justify-center">
    <div className="card-header">
      <p className="text-gold text-center">How to Watch Recorded Games</p>
    </div>
    <p className="text-center">
      Download the .rec file - place in your game directory:
      <code className="pl-2 text-gold italic break-all">
        C:\Users\YourUser\Games\Age of Mythology Retold\yourSteamId\replays
      </code>
      {" - "}launch the game - select {`'Replays'`} in the main menu - enjoy!
    </p>
    <p className="flex font-semibold underline italic flex-wrap text-center text-primary">
      Replays only work on the patch they were recorded on.
    </p>
  </Card>
);

export default HelpCard;
