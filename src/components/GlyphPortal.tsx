import { useEffect, useRef } from 'react'

const stats = [
  ['4+', 'BUSINESS WEBSITES DELIVERED'],
  ['2', 'APPLICATIONS DEVELOPED'],
  ['1,500+', 'REPORTED MISSION MINDFULNESS LEADS'],
  ['₹7–₹10', 'REPORTED COST PER RESULT'],
  ['₹50K', 'CLIENT PAYMENT FOR TRADING SYSTEM'],
  ['₹50K+', 'FREELANCE / CLIENT REVENUE'],
]

export default function GlyphPortal() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const word = wordRef.current
    const content = contentRef.current
    if (!section || !word || !content) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const paint = () => {
      const rect = section.getBoundingClientRect()
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(1, Math.max(0, -rect.top / travel))
      if (reduced) {
        word.style.transform = 'translate(-50%, -50%) scale(1)'
        word.style.opacity = '.12'
        content.style.opacity = '1'
        content.style.transform = 'translateY(0)'
      } else {
        const reveal = Math.min(1, Math.max(0, (progress - .22) / .52))
        const eased = reveal * reveal * (3 - 2 * reveal)
        word.style.transform = `translate(-50%, -50%) scale(${1 + progress * 4.8}) rotate(${(progress - .5) * -5}deg)`
        word.style.opacity = String(Math.max(.08, 1 - progress * 1.2))
        content.style.opacity = String(eased)
        content.style.transform = `translateY(${(1 - eased) * 34}px)`
      }
      raf = requestAnimationFrame(paint)
    }
    raf = requestAnimationFrame(paint)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <section className="glyph-portal" ref={sectionRef} aria-label="Proof of motion">
    <div className="glyph-portal-pin">
      <div className="glyph-portal-rings" aria-hidden="true" />
      <span className="glyph-portal-word" ref={wordRef} aria-hidden="true">PROOF</span>
      <div className="glyph-portal-content" ref={contentRef}>
        <div className="eyebrow"><span>Proof of motion</span><i /></div>
        <h2>Small team<br /><em>energy.</em> Real-world <em>stakes.</em></h2>
        <div className="glyph-stat-grid">{stats.map(([value, label]) => <div className="glyph-stat" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        <p className="glyph-footnote">Evidence available on request — live work, project files, campaign screenshots and payment records.</p>
      </div>
    </div>
  </section>
}
