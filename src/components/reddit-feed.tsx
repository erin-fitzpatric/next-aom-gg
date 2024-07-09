"use client";

import fetchRedditPosts, { RedditPost } from "@/server/fetchRedditPosts";
import Image from "next/image";
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

export default function RedditFeed() {
  const [redditPosts, setRedditPosts] = useState([]) as any[]; //todo type this

  async function getRedditPosts() {
    const response = await fetchRedditPosts();
    setRedditPosts(response);
  }
  useEffect(() => {
    getRedditPosts();
  }, []);

  return (
    <>
      <Card className="p-4">
        <h2 className="text-3xl font-bold text-center">Top Reddit Posts</h2>
        <Carousel>
          <CarouselContent>
            {redditPosts.map((post: RedditPost) => (
              <CarouselItem
                key={post.id}
                className="sm:basis-full md:basis-1/3 lg:basis-1/6 hover:opacity-75 transition-opacity duration-200 ease-in-out"
              >
                <a
                  href={`https://www.reddit.com${post.permalink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div key={post.id} className="flex">
                    <div className="m-2">
                      {post.url && (
                        <div className="h-max">
                          <Image
                            src={post.url}
                            alt={post.title}
                            width={100}
                            height={100}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <div>
                        <h2 className="text-xl text-green-500">{post.title}</h2>
                        <p>{post.author}</p>
                      </div>
                      <div className="flex flex-row space-x-4 justify-start text-center">
                        <p>
                          <ThickArrowUpIcon className="text-gold"></ThickArrowUpIcon>
                          {post.ups}
                        </p>
                        <p>
                          <ChatBubbleIcon className="text-gold"></ChatBubbleIcon>
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
