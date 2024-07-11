"use client";

import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import Image from "next/image";
import { YoutubeVideo } from "@/types/youtube";
import getYoutubeVideos from "@/server/getYoutubeVideos";

export default function FeaturedYoutubeVideos() {
  const [videos, setVideos] = useState<Array<YoutubeVideo>>([]); // todo - fix typing to remove any

  async function fetchVideos(): Promise<void> {
    console.log("fetching videos");
    const result = await getYoutubeVideos();
    setVideos(result);
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <>
      <Card className="p-4 h-full">
        <h2 className="card-header">Featured Videos</h2>
        <div className="grid grid-cols-1 text-center py-4 justify-items-center">
          {videos?.map((video: YoutubeVideo) => (
            <div
              key={video.id.videoId}
              className="flex flex-col p-1 max-w-xs items-center hover:opacity-75 transition-opacity duration-200 ease-in-out hover:outline-double"
            >
              <a
                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  width={video.snippet.thumbnails.medium.width}
                  height={video.snippet.thumbnails.medium.height}
                  priority={true}
                  className="mx-auto"
                />

                <h3 className="mt-2 text-primary overflow">
                  {new DOMParser().parseFromString(video.snippet.title, "text/html").documentElement.textContent}
                </h3>
              </a>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
