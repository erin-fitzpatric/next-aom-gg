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
import fetchRedditPosts from "@/server/fetchRedditPosts";
import { RedditPost } from "@/types/RedditPost";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component

export default function RedditFeed() {
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function getRedditPosts() {
    try {
      const response = await fetchRedditPosts();
      setRedditPosts(response);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch reddit posts, retry limit reached", error);
      setLoading(false); // Stop loading even if the fetch fails
    }
  }

  useEffect(() => {
    getRedditPosts();
  }, []);

  return (
    <>
      <Card className="p-4">
        <div className="flex justify-center">
          <Image
            src="/reddit-logo.png"
            alt="Reddit Logo"
            width={42}
            height={42}
          />
        </div>
        <a href="https://www.reddit.com/r/AgeofMythology/">
          <div className="flex justify-center text-gold cursor-pointer hover:underline">
            r/AgeOfMythology
          </div>
        </a>
        <h2 className="card-header">Top Reddit Posts</h2>
        <Carousel className="pt-4">
          <CarouselContent className="flex items-center">
            {/* Skeleton While Loading */}
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="bg-secondary h-full rounded-3xl mx-2 sm:basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <div className="flex flex-col justify-between p-4 h-full">
                      <div className="flex h-32">
                        <Skeleton className="h-32 w-32 rounded-lg" />{" "}
                        {/* Thumbnail skeleton */}
                        <div className="flex-1 ml-4">
                          <Skeleton className="h-6 w-full mb-2" />{" "}
                          {/* Title skeleton */}
                          <Skeleton className="h-4 w-1/2" />{" "}
                          {/* Author skeleton */}
                          <div className="flex flex-row space-x-4 justify-start text-center mt-2">
                            <Skeleton className="h-4 w-4" />{" "}
                            {/* Upvotes icon skeleton */}
                            <Skeleton className="h-4 w-4" />{" "}
                            {/* Comments icon skeleton */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))
              : redditPosts.map((post: RedditPost) => (
                // Display Reddit Posts
                  <CarouselItem
                    key={post.id}
                    className="bg-secondary h-full rounded-3xl mx-2 sm:basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 hover:opacity-75 transition-opacity duration-200 ease-in-out overflow-hidden"
                  >
                    <a
                      href={`https://www.reddit.com${post.permalink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col justify-between p-4 h-full"
                    >
                      <div className="flex h-32">
                        <div className="m-2">
                          {post.url &&
                            !post.url.startsWith("https://twitter.com") && (
                              <div className="h-32 w-32 overflow-hidden rounded-lg">
                                <Image
                                  src={post.url}
                                  alt={post.title}
                                  width={128}
                                  height={128}
                                  className="object-cover h-16 sm:h-32 w-full"
                                />
                              </div>
                            )}
                        </div>
                        <div className="flex-1 ml-4">
                          <h2 className="text-xl text-primary text-wrap line-clamp-2 leading-2">
                            {post.title}
                          </h2>
                          <p className="whitespace-normal truncate">
                            {post.author}
                          </p>
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
