"use client";
import { SignInDialog } from "./sign-in-dialog-conent";
import { Button } from "./ui/button";

export default function AboutUs() {
  return (
    <div className="text-white min-h-screen py-12">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12">
          About Us
        </h1>

        {/* Welcome Message */}
        <section className="mb-12 text-center">
          <p className="text-lg sm:text-xl mb-6">
            Welcome to <span className="font-semibold">fitzbrogaming</span>,
            where passion for gaming and cutting-edge technology come together
            to create a unique online experience.
          </p>
          <p className="text-base sm:text-lg">
            Our mission is to build an inclusive, innovative, and engaging
            platform that brings together gamers from all walks of life. From
            livestreams to interactive features, we are here to provide a space
            where you can connect, play, and thrive.
          </p>
        </section>

        {/* Our Journey Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
            Our Journey
          </h2>
          <div className="flex flex-col gap-6">
            <p className="text-base sm:text-lg mb-4">
              fitzbrogaming started as a small community of passionate gamers
              who wanted to share their experiences and connect with like-minded
              individuals. From these humble beginnings, we’ve grown into a
              larger platform offering livestreams, tournaments, and interactive
              content for a global audience.
            </p>
            <p className="text-base sm:text-lg">
              Today, we’re proud to serve a thriving community of gamers who
              inspire us to keep pushing the boundaries of what’s possible in
              the gaming world.
            </p>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                Livestreams
              </h3>
              <p>
                Watch your favorite games live, interact with streamers, and be
                part of the action. Our platform supports high-quality streams
                with a user-friendly interface.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                Tournaments
              </h3>
              <p>
                Participate in our regular tournaments for a chance to showcase
                your skills, compete with others, and win exciting rewards.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                Community
              </h3>
              <p>
                Join our thriving community of gamers, engage in discussions,
                share tips, and make new friends. We’re all about fostering an
                inclusive environment.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                Customization
              </h3>
              <p>
                Personalize your gaming experience with customizable overlays,
                in-game features, and more. We believe that every gamer should
                have the tools to make their streams unique.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Join Us</h2>
          <p className="text-base sm:text-lg mb-4">
            Whether you&apos;re a seasoned gamer or just starting out,
            fitzbrogaming has something for everyone. Become a part of our
            community and experience the future of gaming with us!
          </p>

          <a
            href="https://discord.com/invite/Rvthxry"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-500 transition"
          >
            Discord
          </a>
        </section>
      </div>
    </div>
  );
}
