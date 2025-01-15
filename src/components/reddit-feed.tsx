import { Suspense, useEffect, useState } from 'react';
import { Card } from './ui/card';
import { ChatBubbleIcon, ThickArrowUpIcon } from '@radix-ui/react-icons';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import fetchRedditPosts from '@/server/fetchRedditPosts';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

export default function RedditFeed() {
  return (
    <>
      <Card className='p-4'>
        <div className='flex justify-center'>
          <div className='flex justify-center p-1'>
            <Image
              src='/reddit-logo.png'
              alt='Reddit Logo'
              width={52}
              height={52}
            />
          </div>
          <div>
            <a href='https://www.reddit.com/r/AgeofMythology/'>
              <div className='flex justify-center text-gold cursor-pointer hover:underline'>
                r/AgeOfMythology
              </div>
            </a>
            <h2 className='card-header'>Top Reddit Posts</h2>
          </div>
        </div>
        <Carousel className='pt-4 mx-10'>
          <CarouselContent className='flex items-center'>
            <Suspense fallback={<PlaceHolder />}>
              <GalleryItems />
            </Suspense>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Card>
    </>
  );
}

function PlaceHolder() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <CarouselItem
          key={index}
          className='bg-secondary h-full rounded-3xl mx-2 sm:basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 hover:opacity-75 transition-opacity duration-200 ease-in-out overflow-hidden'
        >
          <div className='flex h-32'>
            <div className='m-2'>
              <div className='h-32 w-32 overflow-hidden rounded-lg'>
                <Skeleton className='w-full h-full' />
              </div>
            </div>
            <div className='flex-1 ml-4'>
              <Skeleton className='w-full h-6 mb-2' />
              <Skeleton className='w-3/4 h-4 mb-2' />
              <Skeleton className='w-1/2 h-4' />
            </div>
          </div>
        </CarouselItem>
      ))}
    </>
  );
}

async function GalleryItems() {
  const redditPosts = await fetchRedditPosts().catch(() => null);

  if (!redditPosts) return <PlaceHolder />;

  const gallery = await Promise.all(
    redditPosts.map(async (post) => {
      try {
        if (post.url && isRedditGalleryUrl(post.url)) {
          const response = await fetch(
            `https://www.reddit.com${post.permalink}.json`
          );
          const json = await response.json();
          const items = json[0]?.data?.children[0]?.data?.media_metadata;
          if (items) {
            const images = Object.keys(items).map((key) => {
              const media = items[key];
              const ext = media?.m?.split('/').pop();
              return `https://i.redd.it/${key}.${ext}`;
            });
            return { ...post, images };
          }
        }
      } catch (error) {
        console.error(error);
        return { ...post, images: [] };
      }
      return { ...post, images: [] };
    })
  );

  function getYouTubeVideoId(url: string): string | null {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|(?:.*[?&]v=)|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  }

  function isValidImageUrl(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  }

  function isRedditGalleryUrl(url: string): boolean {
    return url.includes('/gallery/');
  }

  return (
    <>
      {gallery.map((post) => (
        <CarouselItem
          key={post.id}
          className='bg-secondary h-full rounded-3xl mx-2 sm:basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 hover:opacity-75 transition-opacity duration-200 ease-in-out overflow-hidden'
        >
          <a
            href={`https://www.reddit.com${post.permalink}`}
            target='_blank'
            rel='noopener noreferrer'
            className='flex flex-col justify-between p-4 h-full'
          >
            <div className='flex h-32'>
              <div className='m-2'>
                {post.url && !post.url.startsWith('https://twitter.com') && (
                  <div className='h-32 w-32 overflow-hidden rounded-lg'>
                    {post.images.length > 0 ? (
                      post.images.map((imgUrl, index) => (
                        <Image
                          key={index}
                          src={imgUrl}
                          alt={post.title}
                          width={128}
                          height={128}
                          className='object-cover w-full h-full'
                        />
                      ))
                    ) : post.url.includes('youtube.com') ||
                      post.url.includes('youtu.be') ? (
                      <Image
                        src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                          post.url
                        )}/mqdefault.jpg`}
                        alt={post.title}
                        width={128}
                        height={128}
                        className='object-cover w-full h-full'
                      />
                    ) : isValidImageUrl(post.url) ? (
                      <Image
                        src={post.url}
                        alt={post.title}
                        width={128}
                        height={128}
                        className='object-cover w-full h-full'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-gray-200 text-gray-500'>
                        No image available
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className='flex-1 ml-4'>
                <h2 className='text-xl text-primary text-wrap line-clamp-2 leading-2'>
                  {post.title}
                </h2>
                <p className='whitespace-normal truncate'>{post.author}</p>
                <div className='flex flex-row space-x-4 justify-start text-center'>
                  <p>
                    <ThickArrowUpIcon className='text-gold' />
                    {post.ups}
                  </p>
                  <p>
                    <ChatBubbleIcon className='text-gold' />
                    {post.num_comments}
                  </p>
                </div>
              </div>
            </div>
          </a>
        </CarouselItem>
      ))}
    </>
  );
}
