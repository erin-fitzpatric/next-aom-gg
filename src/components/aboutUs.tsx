"use client";

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
            Welcome to <span className="font-semibold">AoM.gg</span>,
            the #1 home for Age of Mythlogy Retold fans, competitors, and creators.
          </p>
          <p className="text-base sm:text-lg">
            Our mission is to build a vibrant community around the game we all love,
            providing a platform for players to connect, compete, and share their passion
            for Age of Mythology Retold.
          </p>
        </section>

        {/* Our Journey Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
            Our Journey
          </h2>
          <div className="flex flex-col gap-6">
            <p className="text-base sm:text-lg mb-4">
              AoM.gg started as a small project by FitzBro to host recorded games and leaderboard stats, 
              and has since grown to become the go-to destination for Age of Mythology Retold players. As an 
              open source project, we’re constantly evolving and improving our platform to better serve the
              community. Get in touch with us on Discord to share your feedback and ideas!
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
                Leaderboards
              </h3>
              <p>
                Compete with other players and climb the leaderboards to prove
                your skill and earn recognition. Our leaderboards are updated in
                real-time, so you can track your progress and see how you stack
                up against the competition.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                Recorded Games
              </h3>
              <p>
                Watch and learn from the best players in the world with our
                extensive library of recorded games. Analyze their strategies,
                build orders, and decision-making to improve your own gameplay. Upload
                your own games to share with the community!
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                Statistics
              </h3>
              <p>
                Track your performance and analyze your gameplay with detailed
                statistics and match history. Identify your strengths and
                weaknesses, and use that information to improve and become a
                better player.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                Resources
              </h3>
              <p>
                
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Join Us</h2>
          <p className="text-base sm:text-lg mb-4">
            Whether you&apos;re a seasoned gamer or just starting out,
            AoM.gg has something for everyone. Become a part of our
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
