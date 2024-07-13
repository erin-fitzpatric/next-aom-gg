"use client";

import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { ChatBubbleIcon, ThickArrowUpIcon } from "@radix-ui/react-icons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import fetchRedditPosts from "@/api/fetchRedditPosts";
import { RedditPost } from "@/types/RedditPost";

export default function RedditFeed() {
  const [redditPosts, setRedditPosts] = useState([]) as any[]; //todo type this

  async function getRedditPosts() {
    console.log("fetching reddit posts");
    // adding a retry because the reddit api is dumb
    try {
      const response = await fetchRedditPosts();
      setRedditPosts(response);
    } catch (error) {
      console.error("Failed to fetch reddit posts, retry limit reached", error);
    }
  }
  
  useEffect(() => {
    getRedditPosts();
  }, []);

  return (
    <>
      <Card className="p-4">
        <h2 className="card-header">Top Reddit Posts</h2>
        <Carousel className="pt-4">
          <CarouselContent className="flex items-center">
            {redditPosts.map((post: RedditPost) => (
              <CarouselItem
                key={post.id}
                className="bg-secondary h-full rounded-3xl mx-2 sm:basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 hover:opacity-75 transition-opacity duration-200 ease-in-out overflow-hidden"
                // Added overflow-hidden to prevent content overflow
              >
                <a
                  href={`https://www.reddit.com${post.permalink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col justify-between p-4 h-full"
                >
                  <div className="flex  h-32">
                    <div className="m-2">
                      {/* TODO - add support for rendering twitter images, this is a temporary soultion */}
                      {post.url &&
                        !post.url.startsWith("https://twitter.com") && (
                          <div className="h-32 w-32 overflow-hidden rounded-lg">
                            {/* Have to use img tag instead of Image here to support animated images */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={post.url}
                              alt={post.title}
                              className="object-cover h-16 sm:h-32 w-full"
                            />
                          </div>
                        )}
                    </div>
                    <div className="flex-1 ml-4">
                      <h2 className="text-xl text-primary text-wrap line-clamp-2 leading-2">
                        {post.title}
                      </h2>
                      {/* Ensure text wraps within available space */}
                      <p className="whitespace-normal truncate">
                        {post.author}
                      </p>
                      {/* Allow text to wrap and truncate with ellipsis */}
                      <div className="flex flex-row space-x-4 justify-start text-center">
                        <p>
                          <ThickArrowUpIcon className="text-gold" />
                          {post.ups}
                        </p>
                        <p>
                          <ChatBubbleIcon className="text-gold" />
                          {post.num_comments}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Card>
    </>
  );
}
