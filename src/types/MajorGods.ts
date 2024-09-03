interface MajorGodData {
  name: string;
  portraitPath: string;
}

const UNKNOWN_PORTRAIT_PATH = "/gods/greeks/major-gods/zeus_icon.png"; // TODO use the random ? icon

export enum MajorGods {
  Nature = 0,
  Zeus = 1,
  Hades = 2,
  Poseidon = 3,
  Ra = 4,
  Isis = 5,
  Set = 6,
  Thor = 7,
  Odin = 8,
  Loki = 9,
  Kronos = 10,
  Oranos = 11,
  Gaia = 12,
  Freyr = 13
}

const MajorGodsByIndex = new Map<number, MajorGodData>([
  [
    0,
    {
      name: "Nature",
      portraitPath: UNKNOWN_PORTRAIT_PATH,
    },
  ],
  [
    1,
    {
      name: "Zeus",
      portraitPath: "/gods/greeks/major-gods/zeus_icon.png",
    },
  ],
  [
    2,
    {
      name: "Hades",
      portraitPath: "/gods/greeks/major-gods/hades_icon.png",
    },
  ],
  [
    3,
    {
      name: "Poseidon",
      portraitPath: "/gods/greeks/major-gods/poseidon_icon.png",
    },
  ],
  [
    4,
    {
      name: "Ra",
      portraitPath: "/gods/egyptians/major-gods/ra_icon.png",
    },
  ],
  [
    5,
    {
      name: "Isis",
      portraitPath: "/gods/egyptians/major-gods/isis_icon.png",
    },
  ],
  [
    6,
    {
      name: "Set",
      portraitPath: "/gods/egyptians/major-gods/set_icon.png",
    },
  ],
  [
    7,
    {
      name: "Thor",
      portraitPath: "/gods/norse/major-gods/thor_icon.png",
    },
  ],
  [
    8,
    {
      name: "Odin",
      portraitPath: "/gods/norse/major-gods/odin_icon.png",
    },
  ],
  [
    9,
    {
      name: "Loki",
      portraitPath: "/gods/norse/major-gods/loki_icon.png",
    },
  ],
  [
    10,
    {
      name: "Kronos",
      portraitPath: "/gods/atlantean/major-gods/kronos_icon.png",
    },
  ],
  [
    11,
    {
      name: "Oranos",
      portraitPath: "/gods/atlantean/major-gods/oranos_icon.png",
    },
  ],
  [
    12,
    {
      name: "Gaia",
      portraitPath: "/gods/atlantean/major-gods/gaia_icon.png",
    },
  ],
  [
    13,
    {
      name: "Freyr",
      portraitPath: "/gods/norse/major-gods/freyr_icon.png",
    },
  ],
]);

export function listMajorGods(): MajorGodData[] {
  const gods = Array.from(MajorGodsByIndex.values());
  gods.shift(); // remove nature
  gods.sort((a, b) => a.name.localeCompare(b.name));
  return gods;
}

export function majorGodIndexToData(index: number): MajorGodData {
  let data = MajorGodsByIndex.get(index);
  if (data === undefined) {
    return {
      name: `Unknown ${index}`,
      portraitPath: UNKNOWN_PORTRAIT_PATH,
    };
  }
  return data;
}
