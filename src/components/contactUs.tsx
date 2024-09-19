export default function ContactUs() {
  return (
    <div className="bg-gray-900 text-white min-h-screen py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12">
          Contact Us
        </h1>

        <section className="mb-12 text-center">
          <p className="text-lg sm:text-xl mb-6">
            You can reach us directly through the following:
          </p>
          <a
            href="https://discord.com/invite/Rvthxry"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-500 transition mb-4"
          >
            Join Us on Discord
          </a>
          <p className="text-lg mt-1">
            Or email us at{" "}
            <a
              href="mailto:fitzbrogaming@gmail.com"
              className="text-blue-400 hover:text-blue-300"
            >
              fitzbrogaming@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
