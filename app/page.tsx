import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { RsvpContainer } from "@/components/rsvp/RsvpContainer";
import type { Rsvp } from "@/lib/types/rsvp";

export default async function HomePage() {
  const cookieStore = await cookies();
  const rsvpId = cookieStore.get("rsvp_id")?.value;

  let initialRsvp: Rsvp | null = null;
  if (rsvpId) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.rpc("get_rsvp_by_id", { rsvp_id: rsvpId });
      if (data && data.length > 0) {
        initialRsvp = data[0] as Rsvp;
      }
    } catch {
      // Ignore database errors, fall back to null
    }
  }

  return (
    <div className="sargam-pattern min-h-full">
      <main className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        <section className="mb-10 text-center md:text-left">
          <h1 className="font-serif text-4xl leading-tight text-sargam-crimson md:text-5xl">
            SARGAM&apos;26 Alumni RSVP
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-sargam-green/85 md:text-lg">
            We are delighted to invite our alumni to SARGAM&apos;26. Kindly fill
            out this form to confirm your attendance and help us make the
            necessary arrangements for the event.
          </p>
          <div className="mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-sargam-gold via-sargam-crimson to-sargam-green" />
        </section>

        {/* RSVP Form Section */}
        <section id="rsvp" className="scroll-mt-24">
          <RsvpContainer initialRsvp={initialRsvp} />
        </section>

        {/* Event Details Section */}
        <section id="details" className="mt-16 scroll-mt-24 rounded-3xl border border-sargam-gold/20 bg-white/70 p-8 shadow-sm backdrop-blur-sm md:mt-24">
          <h2 className="font-serif text-3xl text-sargam-crimson mb-4">Event Details</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sargam-gold mb-1">
                Date & Time
              </p>
              <p className="text-sargam-green font-medium">Thursday, August 20, 2026</p>
              <p className="text-sm text-sargam-green/70">10:00 AM onwards</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sargam-gold mb-1">
                Venue
              </p>
              <p className="text-sargam-green font-medium">MG Auditorium</p>
              <p className="text-sm text-sargam-green/70">VIT Chennai</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sargam-gold mb-1">
                About the Event
              </p>
              <p className="text-sm text-sargam-green/80 leading-relaxed">
                SARGAM&apos;26 is the flagship Onam celebration of our institution, uniting alumni, students, faculty, and guests in a celebration of culture, community, and togetherness. Reconnect with old friends, relive college memories, enjoy cultural performances, and be part of a memorable Onam gathering featuring a traditional Sadhya and festive activities.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mt-16 scroll-mt-24 rounded-3xl border border-sargam-gold/20 bg-white/70 p-8 shadow-sm backdrop-blur-sm md:mt-20">
          <h2 className="font-serif text-3xl text-sargam-crimson mb-4">Contact Information</h2>
          <p className="text-sm text-sargam-green/80 mb-6">
            Have questions or need assistance regarding your RSVP or the event? Reach out to our organizing team:
          </p>
          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-sargam-gold mb-3">Overall Leads</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-sargam-green">Nandhana</p>
                <p className="text-sm text-sargam-green/70">+91 95676 94302</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-sargam-gold mb-3">Coordinators</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-sargam-green">Athul</p>
                <p className="text-sm text-sargam-green/70">+91 83018 71398</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-sargam-green">Bhadra</p>
                <p className="text-sm text-sargam-green/70">+91 79940 73284 </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-sargam-gold/20 px-6 py-6 text-center text-sm text-sargam-green/70">
        SARGAM&apos;26 · Alumni Registration
      </footer>
    </div>
  );
}
