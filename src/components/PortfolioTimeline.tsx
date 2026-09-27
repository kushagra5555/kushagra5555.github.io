import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'

const milestones = [
  { year: '01', label: 'PRODUCT BUILD', title: 'Automated trading system', copy: 'Started with Python during Class 12, then iterated over several months before a version was sold to a client.', detail: 'I learned by building the full loop myself: logic, testing, refinement and delivery. It taught me how to turn an abstract idea into a working product.', role: 'Built the product and improved it through iteration.', href: 'https://github.com/kushagra5555' },
  { year: '02', label: 'GROWTH SYSTEM', title: 'Mission Mindfulness', copy: 'Digital marketing, Meta campaign iteration, website work, content, AI-assisted workflows and lead-generation systems.', detail: 'The work was not only about making a page or running an ad. It connected the first impression, the message, the campaign, the lead journey and the follow-up system.', role: 'Connected acquisition, content, product and sales.', href: 'https://missionmindfulness.in/' },
  { year: '03', label: 'HOSPITALITY WEB', title: 'Butola Guest House', copy: 'A website that helps a visitor understand the rooms, location and stay before contacting the business, extended with a QR + NFC review workflow.', detail: 'The goal was to remove uncertainty. A guest should quickly see what is available, trust the place and know what to do next.', role: 'Designed the information and decision journey.', href: 'https://thebutolaguesthouses.tech/' },
  { year: '04', label: 'WEB + AUTOMATION', title: 'Kakran Organic', copy: 'A product website connected to a practical Wi-Fi order-printing workflow, bringing product discovery and operations together.', detail: 'This project shows the difference between a brochure and a useful system: the public-facing experience and the internal handoff were considered together.', role: 'Built the front-end experience and workflow connection.', href: 'https://kakranorganic.me/' },
  { year: '05', label: 'HEALTHCARE WEB', title: 'Yog Arogyadham', copy: 'A structured medical yoga website that makes treatments, trust signals and consultation pathways easier to understand.', detail: 'For a health-related visitor, clarity and confidence matter. The work translates a complex service into a calmer path from curiosity to enquiry.', role: 'Turned a specialised service into a clear patient journey.', href: 'https://yogaarogyadham.studio/' },
  { year: '06', label: 'HOSPITALITY WEB', title: 'Hotel Ajanta', copy: 'A professional hotel presence focused on rooms, discovery, booking intent and a clearer guest journey.', detail: 'The experience is organised around the questions a traveller has before booking: where it is, what it feels like, what is available and how to continue.', role: 'Shaped the digital presence around booking intent.', href: 'https://www.hotelajanta.com/' },
  { year: '07', label: 'CREATIVE', title: 'Video editing and campaign assets', copy: 'Scripts, reels, visual concepts and social content that carry the idea forward across digital channels.', detail: 'Creative work is treated as part of the system, not decoration. Every edit needs a clear hook, a human feeling and a reason to keep watching.', role: 'Developed the message, edit and visual rhythm.', href: '#creative' },
]

export default function PortfolioTimeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    let raf = 0
    let target = 0
    let current = 0
    const update = () => {
      const rect = section.getBoundingClientRect()
      target = Math.min(1, Math.max(0, -rect.top / Math.max(section.offsetHeight - window.innerHeight, 1)))
      // Keep the cards gliding behind the reading layer instead of snapping
      // into place on smaller screens.
      current += (target - current) * .045
      // Account for the track's absolute left offset so the final card lands
      // inside the viewport instead of stopping with its video/content clipped.
      const travel = Math.max(0, track.scrollWidth + track.offsetLeft - window.innerWidth * .88)
      track.style.transform = `translate3d(${-current * travel}px, 0, 0)`
      track.style.setProperty('--timeline-progress', String(current))
      setProgress(current)
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <section className="portfolio-timeline" ref={sectionRef} aria-label="Kushagra Chaudhary portfolio timeline">
    <div className="portfolio-timeline-pin">
      <div className="portfolio-timeline-head"><div className="eyebrow"><span>Portfolio timeline</span><i /></div><span className="portfolio-timeline-period">WEBSITES / SYSTEMS / CREATIVE</span></div>
      <div className="portfolio-timeline-intro" style={{ '--timeline-intro-opacity': Math.max(.18, 1 - progress * 7) } as CSSProperties}><p>How the work<br /><em>moves forward.</em></p><span>Follow the journey from first product builds to websites, business systems, digital marketing and creative execution.</span><div className="portfolio-timeline-scope"><b>MY RANGE</b><span>Websites · Apps · Growth · Automation · Video</span></div><div className="portfolio-timeline-principles"><span><b>01</b><strong>Start with people</strong><small>Understand what a customer, patient or guest needs to feel confident.</small></span><span><b>02</b><strong>Make it useful</strong><small>Turn information into a clear next step instead of adding noise.</small></span><span><b>03</b><strong>Build the system</strong><small>Connect the visible experience to the work happening behind it.</small></span></div></div>
      <div className="portfolio-timeline-rail"><span className="portfolio-timeline-fill" style={{ transform: `scaleX(${progress})` }} /></div>
      <div className="portfolio-timeline-track" ref={trackRef}>{milestones.map((item) => <a className="portfolio-milestone" href={item.href} target={item.href.startsWith('#') ? undefined : '_blank'} rel={item.href.startsWith('#') ? undefined : 'noreferrer'} key={item.year}><span className="portfolio-milestone-dot" /><span className="portfolio-milestone-number">{item.year}</span><span className="portfolio-milestone-label">{item.label}</span><h2>{item.title}</h2><p>{item.copy}</p><div className="portfolio-milestone-detail"><b>WHAT I DID</b><span>{item.detail}</span><small>{item.role}</small></div><span className="portfolio-milestone-link">View work <ArrowUpRight size={15} /></span></a>)}</div>
      <span className="portfolio-timeline-hint">SCROLL TO EXPLORE ↓</span>
    </div>
  </section>
}
