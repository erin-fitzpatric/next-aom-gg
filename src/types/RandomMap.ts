export interface RandomMapData {
  name: string;
  imagePath: string;
  isWater: boolean;
}

const UNKNOWN_MAP_IMAGE_PATH = "/maps/the_unknown.png"; // TODO use the random ? icon

export const RandomMapDataMap = new Map<string, RandomMapData>([
  [
    "acropolis",
    {
      name: "Acropolis",
      imagePath: "/maps/acropolis.png",
      isWater: false,
    },
  ],
  [
    "air",
    {
      name: "Aïr",
      imagePath: "/maps/air.png",
      isWater: false,
    },
  ],
  [
    "alfheim",
    {
      name: "Alfheim",
      imagePath: "/maps/alfheim.png",
      isWater: false,
    },
  ],
  [
    "anatolia",
    {
      name: "Anatolia",
      imagePath: "/maps/anatolia.png",
      isWater: true,
    },
  ],
  [
    "archipelago",
    {
      name: "Archipelago",
      imagePath: "/maps/archipelago.png",
      isWater: true,
    },
  ],
  [
    "arena",
    {
      name: "Arena",
      imagePath: "/maps/arena.png",
      isWater: false,
    },
  ],
  [
    "black_sea",
    {
      name: "Black Sea",
      imagePath: "/maps/black_sea.png",
      isWater: true,
    },
  ],
  [
    "blue_lagoon",
    {
      name: "Blue Lagoon",
      imagePath: "/maps/blue_lagoon.png",
      isWater: false,
    },
  ],
  [
    "elysium",
    {
      name: "Elysium",
      imagePath: "/maps/elysium.png",
      isWater: false,
    },
  ],
  [
    "erebus",
    {
      name: "Erebus",
      imagePath: "/maps/erebus.png",
      isWater: false,
    },
  ],
  [
    "ghost_lake",
    {
      name: "Ghost Lake",
      imagePath: "/maps/ghost_lake.png",
      isWater: false,
    },
  ],
  [
    "giza",
    {
      name: "Giza",
      imagePath: "/maps/giza.png",
      isWater: false,
    },
  ],
  [
    "gold_rush",
    {
      name: "Gold Rush",
      imagePath: "/maps/gold_rush.png",
      isWater: false,
    },
  ],
  [
    "highland",
    {
      name: "Highland",
      imagePath: "/maps/highland.png",
      isWater: true,
    },
  ],
  [
    "ironwood",
    {
      name: "Ironwood",
      imagePath: "/maps/ironwood.png",
      isWater: false,
    },
  ],
  [
    "islands",
    {
      name: "Islands",
      imagePath: "/maps/islands.png",
      isWater: true,
    },
  ],
  [
    "jotunheim",
    {
      name: "Jotunheim",
      imagePath: "/maps/jotunheim.png",
      isWater: false,
    },
  ],
  [
    "kerlaugar",
    {
      name: "Kerlaugar",
      imagePath: "/maps/kerlaugar.png",
      isWater: true,
    },
  ],
  [
    "land_unknown",
    {
      name: "Land Unknown",
      imagePath: "/maps/land_unknown.png",
      isWater: false,
    },
  ],
  [
    "marsh",
    {
      name: "Marsh",
      imagePath: "/maps/marsh.png",
      isWater: false,
    },
  ],
  [
    "mediterranean",
    {
      name: "Mediterranean",
      imagePath: "/maps/mediterranean.png",
      isWater: true,
    },
  ],
  [
    "megalopolis",
    {
      name: "Megalopolis",
      imagePath: "/maps/megalopolis.png",
      isWater: false,
    },
  ],
  [
    "midgard",
    {
      name: "Midgard",
      imagePath: "/maps/midgard.png",
      isWater: true,
    },
  ],
  [
    "mirage",
    {
      name: "Mirage",
      imagePath: "/maps/mirage.png",
      isWater: false,
    },
  ],
  [
    "mirkwood",
    {
      name: "Mirkwood",
      imagePath: "/maps/mirkwood.png",
      isWater: false,
    },
  ],
  [
    "mount_olympus",
    {
      name: "Mount Olympus",
      imagePath: "/maps/mount_olympus.png",
      isWater: false,
    },
  ],
  [
    "muspellheim",
    {
      name: "Muspellheim",
      imagePath: "/maps/muspellheim.png",
      isWater: false,
    },
  ],
  [
    "nile_shallows",
    {
      name: "Nile Shallows",
      imagePath: "/maps/nile_shallows.png",
      isWater: false,
    },
  ],
  [
    "nomad",
    {
      name: "Nomad",
      imagePath: "/maps/nomad.png",
      isWater: false,
    },
  ],
  [
    "oasis",
    {
      name: "Oasis",
      imagePath: "/maps/oasis.png",
      isWater: false,
    },
  ],
  [
    "river_nile",
    {
      name: "River Nile",
      imagePath: "/maps/river_nile.png",
      isWater: true,
    },
  ],
  [
    "river_styx",
    {
      name: "River Styx",
      imagePath: "/maps/river_styx.png",
      isWater: true,
    },
  ],
  [
    "savannah",
    {
      name: "Savannah",
      imagePath: "/maps/savannah.png",
      isWater: false,
    },
  ],
  [
    "sea_of_worms",
    {
      name: "Sea of Worms",
      imagePath: "/maps/sea_of_worms.png",
      isWater: true,
    },
  ],
  [
    "team_migration",
    {
      name: "Team Migration",
      imagePath: "/maps/team_migration.png",
      isWater: true,
    },
  ],
  [
    "the_unknown",
    {
      name: "The Unknown",
      imagePath: "/maps/the_unknown.png",
      isWater: true,
    },
  ],
  [
    "tiny",
    {
      name: "Tiny",
      imagePath: "/maps/tiny.png",
      isWater: false,
    },
  ],
  [
    "tundra",
    {
      name: "Tundra",
      imagePath: "/maps/tundra.png",
      isWater: false,
    },
  ],
  [
    "valley_of_kings",
    {
      name: "Valley of Kings",
      imagePath: "/maps/valley_of_kings.png",
      isWater: false,
    },
  ],
  [
    "vinlandsaga",
    {
      name: "Vinlandsaga",
      imagePath: "/maps/vinlandsaga.png",
      isWater: true,
    },
  ],
  [
    "watering_hole",
    {
      name: "Watering Hole",
      imagePath: "/maps/watering_hole.png",
      isWater: false,
    },
  ],
]);

export function getAllMaps(): { displayName: string; key: string }[] {
  return Array.from(RandomMapDataMap.entries()).map(([key, mapData]) => ({
    displayName: mapData.name,
    key: key,
  }));
}

export function randomMapNameToData(mapName: string): RandomMapData {
  let data = RandomMapDataMap.get(mapName);
  if (data === undefined) {
    return {
      name: mapName,
      imagePath: UNKNOWN_MAP_IMAGE_PATH,
      isWater: false,
    };
  }
  return data;
}
