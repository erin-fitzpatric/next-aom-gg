import { Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-white py-6">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
        <nav className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 mx-auto">
          <Link href="/terms">
            <p className="hover:text-primary">Terms and Conditions</p>
          </Link>
          <Link href="/about">
            <p className="hover:text-primary">About Us</p>
          </Link>
          <Link href="/contact">
            <p className="hover:text-primary">Contact Us</p>
          </Link>
          <Link href="/privacy">
            <p className="hover:text-primary">Privacy Policy</p>
          </Link>
        </nav>
      </div>
    </footer>
  );
}
