// Define a type for the leaderboard names
export type LeaderboardType = '1v1Supremacy' | 'TeamSupremacy' | 'Deathmatch' | 'TeamDeathmatch';

// Define a constant object to map names to values
export const LeaderboardTypeValues: Record<LeaderboardType, number> = {
  '1v1Supremacy': 1,
  'TeamSupremacy': 2,
  'Deathmatch': 3,
  'TeamDeathmatch': 4,
};

export const LeaderboardTypeNames: Record<number, string> = {
  1: '1v1 Supremacy',
  2: 'Team Supremacy',
  3: 'Deathmatch',
  4: 'Team Deathmatch',
};