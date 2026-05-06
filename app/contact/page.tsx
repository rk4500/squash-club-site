import { ArrowRight } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="pt-[68px] bg-[#05080f]">

      {/* ── PAGE HERO ── */}
      <section className="relative py-28 overflow-hidden scanlines">
        <div className="absolute inset-0 hero-lines opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_100%_50%,rgba(245,168,0,0.05),transparent)]" />
        <div className="absolute right-0 bottom-0 pointer-events-none select-none overflow-hidden leading-none">
          <span className="font-bebas text-[15vw] opacity-[0.06]" style={{WebkitTextStroke:'1px rgba(245,168,0,0.2)', color:'transparent'}}>JOIN</span>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-8">Get Involved</p>
          <h1 className="font-bebas text-[12vw] md:text-8xl tracking-wider leading-none mb-5">
            <span className="text-white">JOIN</span><br />
            <span className="gold-text">THE CLUB</span>
          </h1>
          <p className="font-barlow text-white/40 text-base max-w-xl leading-relaxed font-light">
            Whether you're here to compete or just love the sport — there's a place for you at FLAME Squash.
          </p>
        </div>
      </section>

      <section className="py-16 pb-28 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* ── CONTACT LINKS ── */}
          <div>
            <h2 className="font-bebas text-3xl tracking-wider text-white/50 mb-8">REACH OUT</h2>

            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com/flamesquashclub"
                target="_blank" rel="noopener noreferrer"
                className="card bar-left p-6 flex items-center gap-5 group"
              >
                <div className="w-11 h-11 border border-pink-500/20 bg-pink-500/5 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/15 transition-colors">
                  <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-bebas tracking-wider text-white text-lg group-hover:text-[#f5a800] transition-colors">Instagram</div>
                  <div className="font-barlow text-white/30 text-sm">@flamesquashclub</div>
                </div>
                <ArrowRight size={14} className="text-white/10 group-hover:text-[#f5a800] ml-auto transition-all group-hover:translate-x-1" />
              </a>

              <a
                href="mailto:squashclub@flame.edu.in"
                className="card bar-left p-6 flex items-center gap-5 group"
              >
                <div className="w-11 h-11 border border-[#f5a800]/20 bg-[#f5a800]/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#f5a800]/15 transition-colors">
                  <svg className="w-5 h-5 text-[#f5a800]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <div className="font-bebas tracking-wider text-white text-lg group-hover:text-[#f5a800] transition-colors">Email</div>
                  <div className="font-barlow text-white/30 text-sm">squashclub@flame.edu.in</div>
                </div>
                <ArrowRight size={14} className="text-white/10 group-hover:text-[#f5a800] ml-auto transition-all group-hover:translate-x-1" />
              </a>

              <a
                href="https://wa.me/919999999999"
                target="_blank" rel="noopener noreferrer"
                className="card bar-left p-6 flex items-center gap-5 group"
              >
                <div className="w-11 h-11 border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/15 transition-colors">
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-bebas tracking-wider text-white text-lg group-hover:text-[#f5a800] transition-colors">WhatsApp</div>
                  <div className="font-barlow text-white/30 text-sm">Message us directly</div>
                </div>
                <ArrowRight size={14} className="text-white/10 group-hover:text-[#f5a800] ml-auto transition-all group-hover:translate-x-1" />
              </a>

              {/* Location */}
              <div className="border border-white/5 bg-[#080d17] p-6 mt-2">
                <p className="font-condensed text-[10px] tracking-[0.25em] uppercase text-white/20 mb-3">Location</p>
                <p className="font-barlow text-white/35 text-sm leading-relaxed">
                  Arjuna Squash Courts<br />
                  FLAME University, Lavale<br />
                  Pune, Maharashtra 412115
                </p>
              </div>
            </div>
          </div>

          {/* ── HOW TO JOIN ── */}
          <div>
            <h2 className="font-bebas text-3xl tracking-wider text-white/50 mb-8">HOW TO JOIN</h2>

            <div className="flex flex-col">
              {[
                { n: '01', title: 'Follow Us', desc: "Follow @flamesquashclub on Instagram. All tryout announcements, events, and ladder editions are posted there first." },
                { n: '02', title: 'Tryouts', desc: "Team tryouts are held at the start of each academic year. 15+ men and 7+ women compete in a round-robin format over two days." },
                { n: '03', title: 'Squash Ladder', desc: "Register for a Ladder edition (₹100). Compete for a spot in the Top 20. Win challenge matches to climb the rankings." },
                { n: '04', title: 'Core Committee', desc: "CC recruitment opens every September via Google Form. Roles across Events, Logistics, Social Media, Design, Outreach and more." },
              ].map((s, i) => (
                <div key={s.n} className={`flex gap-7 py-7 ${i < 3 ? 'border-b border-white/5' : ''}`}>
                  <span className="font-bebas text-5xl leading-none text-outline text-white/8 flex-shrink-0 w-12" style={{WebkitTextStroke:'1px rgba(245,168,0,0.15)', color:'transparent'}}>
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-bebas text-xl tracking-wider text-white mb-2">{s.title}</h3>
                    <p className="font-barlow text-white/30 text-sm leading-relaxed font-light">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
