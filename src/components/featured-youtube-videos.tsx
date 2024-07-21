"use client";

import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import Image from "next/image";
import getYoutubeVideos from "@/server/controllers/youtube-controller";
import { IYoutubeVideo } from "@/types/YoutubeTypes";

export default function FeaturedYoutubeVideos() {
  const [videos, setVideos] = useState<Array<IYoutubeVideo>>([]);

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
      <Card className="h-full py-4">
        <h2 className="card-header">Featured Videos</h2>
        <div className="grid grid-cols-1 text-center justify-items-center my-4 ">
          {videos?.map((video: IYoutubeVideo) => (
            <div
              key={video.videoId}
              className="mx-1 border-2 border-amber-400 rounded-lg my-1 flex flex-col p-1 max-w-xs items-center hover:opacity-75 transition-opacity duration-200 ease-in-out hover:outline-double"
            >
              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
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

                <h3 className="p-1 rounded-lg text-primary overflow bg-secondary line-clamp-3 font-semibold">
                  {
                    new DOMParser().parseFromString(
                      video.snippet.title,
                      "text/html"
                    ).documentElement.textContent
                  }
                </h3>
              </a>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
