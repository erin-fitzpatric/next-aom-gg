import { Card } from "./ui/card";

const taunts = [
  { number: 1, text: "Yes" },
  { number: 2, text: "No" },
  { number: 3, text: "Food please" },
  { number: 4, text: "Wood please" },
  { number: 5, text: "Gold please" },
  { number: 6, text: "Do you have extra resources?" },
  { number: 7, text: "Aww" },
  { number: 8, text: "Meet here" },
  { number: 9, text: "Ooh" },
  { number: 10, text: "Are you ready?" },
  { number: 11, text: "Laugh" },
  { number: 12, text: "I need help" },
  { number: 13, text: "Sir, Blame it on your firewall" },
  { number: 14, text: "Start the game already" },
  { number: 15, text: "Attack now" },
  { number: 16, text: "Build a wonder" },
  { number: 17, text: "I have extra wood" },
  { number: 18, text: "I have extra food" },
  { number: 19, text: "I have extra gold" },
  { number: 20, text: "You’re my hero" },
  { number: 21, text: "I’m scoutin!" },
  { number: 22, text: "Whatever" },
  { number: 23, text: "Prostagma" },
  { number: 24, text: "Are we there yet?" },
  { number: 25, text: "Hey, weren’t you already voted off the island?" },
  { number: 26, text: "Ouch, that had to hurt" },
  { number: 27, text: "What happened to all the stone" },
  { number: 28, text: "Throw things at me" },
  { number: 29, text: "Scream" },
  { number: 30, text: "Wololo" },
  { number: 31, text: "You’re very brave when you’re killing unarmed farmers" },
  { number: 32, text: "Turn back now, mortal" },
  { number: 33, text: "You may feel less like fighting after I pull off your head" },
  { number: 34, text: "If you give up now, we’ll grant you a quick death" },
  { number: 35, text: "Coward" },
  { number: 36, text: "Did I mention that I’m a god now" },
  { number: 37, text: "Not a wise decision, but a decision nonetheless" },
  { number: 38, text: "What do I gotta do to get some food around here?" },
  { number: 39, text: "I need some backup" },
  { number: 40, text: "Fire in the hole!" },
  { number: 41, text: "What a baby" },
  { number: 42, text: "I wish he would stop doing that" },
  { number: 43, text: "Ehh what a foolish decision" },
  { number: 44, text: "Ehh you are such a fool" },
  { number: 999, text: "999 theme" },
];

export default function TauntsList() {
  return (
    <Card className="p-4 mx-4 sm:mx-8 md:mx-16 lg:mx-32 mt-4">
      {/* header */}
      <div className="card-header text-gold">
        <h2>Age of Mythology Taunts</h2>
      </div>

      {/* content */}
      <div className="mt-2">
        <div className="overflow-x-auto">
          <table className="table-auto w-full min-w-full">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left align-middle">Number to type</th>
                <th className="p-2 text-left align-middle">Taunt</th>
              </tr>
            </thead>
            <tbody>
              {taunts.map((taunt) => (
                <tr key={taunt.number} className="hover:bg-muted transition duration-200">
                  <td className="p-2 align-middle">{taunt.number}</td>
                  <td className="p-2 align-middle">{taunt.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
