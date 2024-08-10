export enum Errors {
  UNIQUE_KEY_VIOLATION = "UNIQUE_KEY_VIOLATION",
  ERROR_UPLOADING_REC = "ERROR_UPLOADING_REC",
  ERROR_DOWNLOADING_REC = "ERROR_DOWNLOADING_REC",
  ERROR_FETCHING_RECS = "ERROR_FETCHING_RECS",
  ERROR_INCREMENTING_DOWNLOAD_COUNT = "ERROR_INCREMENTING_DOWNLOAD_COUNT",

  // Rec parser outcomes
  UNSUPPORTED_GAME_SIZE = "UNSUPPORTED_GAME_SIZE",                // Currently limiting to 1v1. Also thrown if there seems to be only one team in the data
  GAME_IS_BENCHMARK = "GAME_IS_BENCHMARK",                        // Game looks like a rec of the benchmark
  FILE_IS_NOT_A_RECORDED_GAME = "FILE_IS_NOT_A_RECORDED_GAME",    // Game doesn't look like an AoM file
  GAME_HAS_AI_PLAYERS = "GAME_HAS_AI_PLAYERS",                    // Game has any AI players in it
  NOT_A_MULTIPLAYER_GAME = "NOT_A_MULTIPLAYER_GAME",              // Rec doesn't have metadata and doesn't look like a benchmark
  PARSER_INTERNAL_ERROR = "PARSER_INTERNAL_ERROR",                // Thrown by other (technical) parser errors
}