import { Player } from "@/types/player";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Card } from "../ui/card";

async function getData(): Promise<Player[]> {
  // Fetch data from your API here.
  return [
    {
      id: "2",
      name: "FitzBro",
      rank: 2,
      winPercent: 0.75,
      totalGames: 100,
    },
    {
      id: "1",
      name: "yak_aoe",
      rank: 1,
      winPercent: 0.8,
      totalGames: 132,
    },
    {
      id: "3",
      name: "Daut",
      rank: 3,
      winPercent: 0.7,
      totalGames: 90,
    },
    {
      id: "4",
      name: "Viper",
      rank: 4,
      winPercent: 0.65,
      totalGames: 80,
    },
    {
      id: "5",
      name: "Hera",
      rank: 5,
      winPercent: 0.6,
      totalGames: 70,
    },
    {
      id: "6",
      name: "MbL",
      rank: 6,
      winPercent: 0.55,
      totalGames: 60,
    },
    {
      id: "7",
      name: "Nicov",
      rank: 7,
      winPercent: 0.5,
      totalGames: 50,
    },
    {
      id: "8",
      name: "Liereyy",
      rank: 8,
      winPercent: 0.45,
      totalGames: 40,
    },
    {
      id: "9",
      name: "Tatoh",
      rank: 9,
      winPercent: 0.4,
      totalGames: 30,
    },
    {
      id: "10",
      name: "Hera",
      rank: 10,
      winPercent: 0.35,
      totalGames: 20,
    },
    {
      id: "11",
      name: "MbL",
      rank: 11,
      winPercent: 0.3,
      totalGames: 10,
    },
    {
      id: "12",
      name: "frerbud",
      rank: 12,
      winPercent: 0.25,
      totalGames: 5,
    }
  ];
}

export default async function LeaderboardPage() {
  const data = await getData();

  return (
    <>
      <Card className="p-4">
        <div className="text-3xl font-bold text-center">
          <h1>Leaderboard</h1>
        </div>
        <div className="container mx-auto py-4">
          <DataTable columns={columns} data={data} />
        </div>
      </Card>
    </>
  );
}