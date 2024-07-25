// Splitting the teams between the left and right in the most even way possible turns out to be
// a variant of the subset sum problem

import { IRecordedGame } from "@/types/RecordedGame";
import { RecordedGamePlayerMetadata } from "@/types/RecordedGameParser";

// This is a modification (to find nearest, plus early bailing) of https://stackoverflow.com/questions/4355955/subset-sum-algorithm
function subsetSumClosest(vals: number[], targ: number): number[]
{
    const d: boolean[][] = [];
    // d[i, j] = is there a subset of vals that sums to exactly j within the first i elements

    // summing to 0 is always possible by simply picking no values
    for (let i = 0; i<= vals.length; i++)
    {
        d[i] = [];
        d[i][0] = true;
    }
    const minValue = Math.min(...vals);
    // The highest value that is a possible response to the problem is the sum of all possible values, but hopefully we never get there
    const maxConsiderValue = vals.reduce((prev, current) => { return prev + current});
    let foundExactSolution = false;
    let bestSolutionError = maxConsiderValue;
    let bestSolutionTarget = maxConsiderValue;
    let bestSolutionNumElements = vals.length;
    let matrixXDim = 0;
    for (let numElementsToConsider = 1; numElementsToConsider<= vals.length; numElementsToConsider++)
    {
        matrixXDim = numElementsToConsider;
        for (let targetSum = 1; targetSum<= maxConsiderValue; targetSum++)
        {
            // If we are looking past the target, and the error of any solutions found this iteration exceeds the best known
            // this inner loop is pointless to keep running because it's worse than something else known
            let thisError = Math.abs(targetSum-targ);
            if (targetSum > targ && thisError >= bestSolutionError)
            {
                break;
            }

            let val = vals[numElementsToConsider-1];
            if (val == targetSum) // value being considered is exactly the sum we are looking for
            {
                d[numElementsToConsider][targetSum] = true;
            }
            else if (d[numElementsToConsider-1][targetSum]) // if considering up to 1 less element can get this sum, we can too by not picking the value at this index
            {
                d[numElementsToConsider][targetSum] = true;
            }
            else if (d[numElementsToConsider-1][targetSum-val]) // if considering up to 1 less element can get (this sum - the current value), we can get this sum by picking the value
            {
                d[numElementsToConsider][targetSum] = true;
            }
            // If we get an exact solution, stop everything
            if (targetSum == targ && d[numElementsToConsider][targ])
            {
                foundExactSolution = true;
                bestSolutionTarget = targ;
                bestSolutionNumElements = numElementsToConsider;
                break;
            }
            if (d[numElementsToConsider][targetSum] && thisError < bestSolutionError)
            {
                bestSolutionError = thisError;
                bestSolutionTarget = targetSum;
                bestSolutionNumElements = numElementsToConsider;
            }
        }
        if (foundExactSolution) break;
    }
    let sumRemaining = bestSolutionTarget;
    let valuesPicked: number[] = [];
    let startNumElements = Math.min(matrixXDim, bestSolutionNumElements);
    for (let numElementsToConsider=startNumElements; numElementsToConsider > 0; numElementsToConsider--)
    {
        if (!d[numElementsToConsider][sumRemaining])
        {
            throw new Error(`Subset sum failed: matrix pos ${numElementsToConsider} ${sumRemaining} should be true`)
        }
        // Find the boundary where making this sum isn't possible any more
        while (d[numElementsToConsider-1][sumRemaining])
        {
            numElementsToConsider--;
        }
        // and get that value
        const thisVal = vals[numElementsToConsider-1];
        valuesPicked.push(thisVal);
        sumRemaining -= thisVal;
        if (sumRemaining <= 0)
            break;
    }

    return valuesPicked;
}

export function teamIndexToPlayerData(metadata: IRecordedGame, teamIndex: number): RecordedGamePlayerMetadata[]
{
    return metadata.teams[teamIndex].map((playerIndex) => { return metadata.playerData[playerIndex]});
}

/**
 * Split team data into two, one for each side of the map image.
 * @returns Two arrays, one for each side, containing the .teams indexes that should go on each side
 */
export function splitTeams(metadata: IRecordedGame): {left: number[], right: number[]}
{
    // TODO hack for old mongo format 
    
    if (metadata.teams === undefined)
    {
        metadata.teams = [];
        const teamIdToTeamArrayIndex = new Map<number, number>();
        for (const playerData of metadata.playerData)
        {
            // Mother nature doesn't belong to a team
            if (playerData.id == 0) continue;
            const teamId = (playerData as any).teamid || playerData.teamId;
            let index = teamIdToTeamArrayIndex.get(teamId);
            if (index === undefined)
            {
                index = metadata.teams.length;
                teamIdToTeamArrayIndex.set(teamId, index);
                metadata.teams.push([playerData.id]);
            }
            else
            {
                metadata.teams[index].push(playerData.id);
            }
            console.log(`p${playerData.id} has team ${teamId}`);
        }
    }
    

  // Fast track the case of two teams
  const numTeams = metadata.teams.length;
  if (numTeams == 2)
  {
    return {left: [0], right: [1]};
  }
  const target = Math.round(metadata.gameNumPlayers/2);
  const teamSizes = metadata.teams.map((team) => { return team.length });
  const optimalSizes = subsetSumClosest(teamSizes, target);
  const setOne: number[] = [];
  const setTwo: number[] = [];
  for (let teamIndex=0; teamIndex<teamSizes.length; teamIndex++)
  {
    const teamSize = teamSizes[teamIndex];
    if (optimalSizes.indexOf(teamSize) > -1)
    {
      setOne.push(teamIndex);
      optimalSizes.splice(optimalSizes.indexOf(teamSize), 1);
    }
    else
    {
      setTwo.push(teamIndex);
    }
  }
  // For consistency, put the set with fewer teams on the left
  if (setOne.length < setTwo.length)
  {
    return {left: setOne, right: setTwo};
  }
  return {left: setTwo, right: setOne};
}

