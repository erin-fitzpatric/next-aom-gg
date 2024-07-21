export interface IYoutubeVideo {
  videoId: string;
  snippet: {
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    thumbnails: IYoutubeThumbnail;
    channelTitle: string;
  };
}

export interface IYoutubeThumbnail {
  default: IYoutubeThumbnailType
  medium: IYoutubeThumbnailType
  high: IYoutubeThumbnailType
  standard?: IYoutubeThumbnailType 
  maxres?: IYoutubeThumbnailType 
}


export interface IYoutubeThumbnailType {
  url: string
  width: number
  height: number
}

// DEPRECATED
// export interface YoutubeVideoStatistics {
//   viewCount: string
//   likeCount: string
//   dislikeCount: string
//   favoriteCount: string
//   commentCount: string
// }

// export interface YoutubeVideoStatus {
//   uploadStatus: string
//   privacyStatus: string
//   license: string
//   embeddable: boolean
//   publicStatsViewable: boolean
// }

// export interface YoutubeVideoContentDetails {
//   duration: string
//   dimension: string
//   definition: string
//   caption: string
//   licensedContent: boolean
//   projection: string
// }

// export interface YoutubeVideoSnippet {
//   publishedAt: Date
//   channelId: string
//   title: string
//   description: string

//   channelTitle: string
//   liveBroadcastContent: string

// }



export interface YoutubeVideoParams {
  key?: string
  part?: string
  id?: string
  h1?: string
  maxHeight?: number
  maxResults?: number
  maxWidth?: number
  pageToken?: string
  regionCode?: string
  videoCategoryId?: string
}

export interface YoutubeDownloadOptions {
  quality?: "144p" | "240p" | "270p" | "360p" | "480p" | "720p" | "720p60" | "1080p" | "1080p60" | "1440p" | "1440p60" | "2160p" | "2160p60" | "4320p" | "4320p60"
  format?: "mp4" | "flv" | "3gp" | "webm" | "ts"
}