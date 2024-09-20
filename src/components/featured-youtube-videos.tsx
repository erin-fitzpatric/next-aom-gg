"use client";

import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import Image from "next/image";
import getYoutubeVideos from "@/server/controllers/youtube-controller";
import { IYoutubeVideo } from "@/types/YoutubeTypes";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedYoutubeVideos() {
  const [videos, setVideos] = useState<Array<IYoutubeVideo>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchVideos(): Promise<void> {
    const result = await getYoutubeVideos();
    setVideos(result);
    setLoading(false);
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <>
      <Card className="py-4">
        <div>
          <Image
            src="/youtube-logo.png"
            alt="Youtube Logo"
            width={40}
            height={40}
            className="mx-auto"
          />
        </div>
        <h2 className="card-header">Featured Videos</h2>
        <div className="grid xl:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 text-center justify-items-center my-4 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="mx-1 border-2 border-amber-400 rounded-lg my-1 flex flex-col p-1 max-w-xs w-full items-center"
                >
                  <Skeleton className="w-full h-44 mb-2" />{" "}
                  {/* Thumbnail skeleton */}
                  <Skeleton className="w-full h-6 mb-2" />{" "}
                  {/* Title skeleton */}
                </div>
              ))
            : videos?.map((video: IYoutubeVideo) => (
                <div
                  key={`${video.videoId}+${video.snippet.title}`}
                  className="mx-1 border-2 border-amber-400 rounded-lg my-1 flex flex-col p-1 max-w-xs w-full items-center hover:opacity-75 transition-opacity duration-200 ease-in-out hover:outline-double"
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
                          "text/html",
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
