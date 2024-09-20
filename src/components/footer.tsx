import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-white py-6">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl font-semibold mb-2">fitzbrogaming</h2>
          <p className="text-gray-400">
            Bringing gamers together with passion and innovation.
          </p>
        </div>

        <nav className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
          <Link href="/terms">
            <p className="hover:text-blue-400">Terms and Conditions</p>
          </Link>
          <Link href="/about">
            <p className="hover:text-blue-400">About Us</p>
          </Link>
          <Link href="/contact">
            <p className="hover:text-blue-400">Contact Us</p>
          </Link>
          <Link href="/privacy">
            <p className="hover:text-blue-400">Privacy Policy</p>
          </Link>
        </nav>
      </div>
    </footer>
  );
}
