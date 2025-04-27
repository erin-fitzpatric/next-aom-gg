"use client";

import { memo } from "react";
import { Card } from "../ui/card";

/**
 * HelpCard - Provides instructions on how to use recorded game files
 *
 * This component displays a card with instructions for users on how to:
 * 1. Download recorded game files
 * 2. Place them in the correct directory
 * 3. Access them in the game
 *
 * It also includes an important note about version compatibility.
 */
export const HelpCard = memo(() => (
  <Card className="p-4 w-full bg-secondary flex flex-col items-center justify-center shadow-sm">
    <div className="card-header mb-2">
      <h2 className="text-gold text-center font-medium">How to Watch Recorded Games</h2>
    </div>

    <div className="space-y-2 max-w-2xl">
      <p className="text-center">
        Download the .rec file - place in your game directory:
        <code className="pl-2 text-gold italic break-all block mt-1 mb-1 bg-background/50 p-1 rounded">
          C:\Users\YourUser\Games\Age of Mythology Retold\yourSteamId\replays
        </code>
        {" - "}launch the game - select {`'Replays'`} in the main menu - enjoy!
      </p>

      <p className="font-semibold underline italic text-center text-primary">
        Replays only work on the patch they were recorded on.
      </p>
    </div>
  </Card>
));

// Display name for debugging
HelpCard.displayName = "HelpCard";

export default HelpCard;
