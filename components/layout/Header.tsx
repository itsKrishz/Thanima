import Link from "next/link";
import Image from "next/image";
import { getAdminUser } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/admin/SignOutButton";

export async function Header() {
  const admin = await getAdminUser();
  const isAdmin = !!admin;

  return (
    <header className="sticky top-0 z-50 border-b border-sargam-gold/30 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-sargam-gold bg-white p-0.5 md:h-14 md:w-14">
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src="/sagram_logo.png"
                alt="Sargam Logo"
                fill
                sizes="(max-width: 768px) 48px, 56px"
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sargam-gold">
              SARGAM&apos;26
            </p>
            <p className="font-serif text-sm text-sargam-green md:text-base">Alumni Portal</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/" className="text-sm font-medium text-sargam-green hover:text-sargam-gold transition-colors">
            Home
          </Link>
          <Link href="/#rsvp" className="text-sm font-medium text-sargam-green hover:text-sargam-gold transition-colors">
            RSVP
          </Link>
          <Link href="/#details" className="text-sm font-medium text-sargam-green hover:text-sargam-gold transition-colors">
            Event Details
          </Link>
          <Link href="/#contact" className="text-sm font-medium text-sargam-green hover:text-sargam-gold transition-colors">
            Contact
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-sargam-crimson hover:opacity-80 transition-opacity">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Sign Out Button for Logged-in Admins */}
        {isAdmin && (
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-sargam-green/60 md:inline">Admin Mode</span>
            <SignOutButton />
          </div>
        )}
      </div>
    </header>
  );
}
