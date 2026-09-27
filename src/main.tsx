import { StrictMode, useEffect, useRef, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDownRight, ArrowUpRight, Bot, Code2, Mail, Megaphone, MessageCircle, Play, Video, Workflow, X } from 'lucide-react'
import ScrollMorphWork from './components/ScrollMorphWork'
import ScrollVideoHero from './components/ScrollVideoHero'
import DisplayCards from './components/DisplayCards'
import Testimonials from './components/Testimonials'
import GlyphPortal from './components/GlyphPortal'
import PortfolioTimeline from './components/PortfolioTimeline'
import WorkingModelLoop from './components/WorkingModelLoop'
import ParticleArrivalStats from './components/ParticleArrivalStats'
import ConnectedExecution from './components/ConnectedExecution'
import { RevealBlock, RevealLines, RevealWords } from './components/Reveal'
import './styles.css'

const projects = [
  { number: '01', name: 'Mission Mindfulness', type: 'Growth system · Website · Automation', url: 'https://missionmindfulness.in/', accent: 'lime' },
  { number: '02', name: 'Kakran Organic', type: 'Workflow automation · Wi-Fi printing', url: 'https://kakranorganic.me/', accent: 'orange' },
  { number: '03', name: 'Yog Arogyadham', type: 'Healthcare website · Content system', url: 'https://yogaarogyadham.studio/', accent: 'blue' },
  { number: '04', name: 'Butola Guest House', type: 'Hospitality · QR/NFC review flow', url: 'https://thebutolaguesthouses.tech/', accent: 'pink' },
  { number: '05', name: 'Hotel Ajanta', type: 'Hospitality website · Digital presence', url: 'https://www.hotelajanta.com/', accent: 'yellow' },
]

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.classList.add('is-visible'); observer.disconnect() }
    }, { threshold: 0.14 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return ref
}

function useSpotlightCards() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-glow-card]'))
    const syncPointer = (event: PointerEvent) => {
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        card.style.setProperty('--glow-x', `${event.clientX - rect.left}px`)
        card.style.setProperty('--glow-y', `${event.clientY - rect.top}px`)
        card.style.setProperty('--glow-hue', String(card.dataset.glowHue ?? 120))
      })
    }
    document.addEventListener('pointermove', syncPointer)
    return () => document.removeEventListener('pointermove', syncPointer)
  }, [])
}

function SiteWideMotion() {
  const cursorRef = useRef<HTMLSpanElement>(null)
  const trailRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const trail = trailRef.current
    const label = labelRef.current
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!cursor || !trail || !label || !finePointer.matches) return

    document.body.classList.add('has-site-cursor')
    const clickables = Array.from(document.querySelectorAll<HTMLElement>('a, button'))
    // These sections own their positioning and scroll choreography. Applying the
    // generic section transform to them shifts their internal layers and makes
    // the timeline/case-study content appear to overlap while scrolling.
    const sections = Array.from(document.querySelectorAll<HTMLElement>(
      'main > section:not(.portfolio-timeline):not(.scroll-morph-work):not(.mission-case):not(.glyph-portal):not(.connected-execution):not(#model)'
    ))
    sections.forEach((section) => section.classList.add('site-motion-section'))

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('site-section-seen')
      })
    }, { threshold: .18 })
    sections.forEach((section) => sectionObserver.observe(section))

    let frame = 0
    let targetX = -100
    let targetY = -100
    let currentX = -100
    let currentY = -100
    let trailX = -100
    let trailY = -100
    let active = false
    const paint = () => {
      frame = 0
      currentX += (targetX - currentX) * .2
      currentY += (targetY - currentY) * .2
      trailX += (targetX - trailX) * .1
      trailY += (targetY - trailY) * .1
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`
      if (active || Math.abs(targetX - currentX) > .2 || Math.abs(targetY - currentY) > .2) frame = requestAnimationFrame(paint)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint) }
    const onMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      clickables.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const dx = event.clientX - (rect.left + rect.width / 2)
        const dy = event.clientY - (rect.top + rect.height / 2)
        const distance = Math.hypot(dx, dy)
        const strength = distance < 130 ? 1 - distance / 130 : 0
        element.style.setProperty('--mag-x', `${Math.max(-4, Math.min(4, dx * strength * .06))}px`)
        element.style.setProperty('--mag-y', `${Math.max(-4, Math.min(4, dy * strength * .06))}px`)
      })
      schedule()
    }
    const onOver = (event: PointerEvent) => {
      const element = (event.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor-label]')
      if (!element) return
      active = true
      cursor.classList.add('is-hovering')
      trail.classList.add('is-hovering')
      label.textContent = element.dataset.cursorLabel ?? (element.closest('.project-row, .reel-card') ? 'view' : '')
      cursor.classList.toggle('has-label', Boolean(label.textContent))
      schedule()
    }
    const onOut = (event: PointerEvent) => {
      const from = (event.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor-label]')
      const to = (event.relatedTarget as HTMLElement | null)?.closest?.('a, button, [data-cursor-label]')
      if (!from || from === to) return
      active = false
      cursor.classList.remove('is-hovering', 'has-label')
      trail.classList.remove('is-hovering')
      label.textContent = ''
      schedule()
    }
    const onPointerDown = () => { cursor.classList.add('is-pressed'); trail.classList.add('is-pressed') }
    const onPointerUp = () => { cursor.classList.remove('is-pressed'); trail.classList.remove('is-pressed') }
    const onScroll = () => {
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        const offset = Math.max(-24, Math.min(24, (window.innerHeight / 2 - (rect.top + rect.height / 2)) * .025))
        section.style.setProperty('--section-depth', `${offset * (index % 2 ? .75 : 1)}px`)
      })
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })
    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    if (!reducedMotion.matches) schedule()
    return () => {
      if (frame) cancelAnimationFrame(frame)
      document.body.classList.remove('has-site-cursor')
      sectionObserver.disconnect()
      sections.forEach((section) => section.classList.remove('site-motion-section', 'site-section-seen'))
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return <><span className="site-cursor-trail" ref={trailRef} aria-hidden="true" /><span className="site-cursor" ref={cursorRef} aria-hidden="true"><span ref={labelRef} /></span></>
}

function SectionIntro({ eyebrow, title, children }: { eyebrow: string, title: ReactNode, children?: ReactNode }) {
  const ref = useReveal()
  return <div className="section-intro reveal-block" ref={ref}><div className="eyebrow"><span>{eyebrow}</span><i /></div><h2>{title}</h2>{children}</div>
}

function Work() {
  const ref = useReveal()
  return <section className="section work-section" id="work"><SectionIntro eyebrow="Selected work" title={<>A few things I’ve<br /><em>made real.</em></>}><p className="intro-copy">Websites are only the visible layer. The interesting work is the thinking underneath: making a business easier to find, easier to run, or easier to grow.</p></SectionIntro><div className="project-list" ref={ref}>{projects.map((project) => <a className="project-row" key={project.number} href={project.url} target="_blank" rel="noreferrer"><span className="project-number">{project.number}</span><span className={`project-dot ${project.accent}`} /><span className="project-name">{project.name}</span><span className="project-type">{project.type}</span><ArrowUpRight className="project-arrow" size={24} /></a>)}<div className="project-row more-row"><span className="project-number">+</span><span className="project-dot ghost" /><span className="project-name">More in progress</span><span className="project-type">There’s more work to add here</span></div></div></section>
}

function Proof() {
  return <GlyphPortal />
}

function useFlagshipSpine() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const section = ref.current
    if (!section) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const beats = Array.from(section.querySelectorAll<HTMLElement>('[data-case-beat]'))
    const observers = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.classList.contains('case-beat-seen')) return
        const node = entry.target as HTMLElement
        const beat = node.dataset.caseBeat
        node.classList.add('case-beat-seen')
        if (beat) section.querySelector(`[data-spine-tick="${beat}"]`)?.classList.add('is-active')
      })
    }, { threshold: 0.15 })
    beats.forEach((beat) => observers.observe(beat))
    let raf = 0
    const updateSpine = () => {
      const rect = section.getBoundingClientRect()
      const span = Math.max(section.offsetHeight - 260, 1)
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top - 130) / span))
      section.style.setProperty('--case-spine-progress', String(progress))
      raf = requestAnimationFrame(updateSpine)
    }
    raf = requestAnimationFrame(updateSpine)
    return () => { observers.disconnect(); cancelAnimationFrame(raf) }
  }, [])
  return ref
}

function EvidenceGallery() {
  const [activeImage, setActiveImage] = useState<string | null>(null)
  useEffect(() => {
    if (!activeImage) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setActiveImage(null) }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown) }
  }, [activeImage])

  const evidence = [
    { src: '/evidence/meta-campaigns.png', alt: 'Meta Ads campaign dashboard showing campaign performance' },
    { src: '/evidence/meta-campaign-detail.png', alt: 'Meta Ads campaign dashboard with lead and cost-per-result data' },
  ]

  return <>
    <figure className="case-evidence"><div>{evidence.map(({ src, alt }) => <button className="case-evidence-image" type="button" key={src} onClick={() => setActiveImage(src)} aria-label="Open Meta Ads screenshot full screen"><img src={src} alt={alt} /><span>Open full screen ↗</span></button>)}</div><figcaption>Campaign evidence — click either screenshot to inspect the Meta Ads results at full size.</figcaption></figure>
    {activeImage && <div className="evidence-lightbox" role="dialog" aria-modal="true" aria-label="Meta Ads campaign screenshot" onClick={() => setActiveImage(null)}><button className="evidence-lightbox-close" type="button" onClick={() => setActiveImage(null)} aria-label="Close full-screen screenshot"><X size={24} /></button><img src={activeImage} alt="Expanded Meta Ads campaign screenshot" onClick={(event) => event.stopPropagation()} /></div>}
  </>
}

function FlagshipCase() {
  const ref = useFlagshipSpine()
  return <section className="case-section mission-case" ref={ref}><div className="case-spine" aria-hidden="true"><span className="case-spine-fill" /><i data-spine-tick="headline" /><i data-spine-tick="lede" /><i data-spine-tick="list-01" /><i data-spine-tick="list-02" /><i data-spine-tick="list-03" /><i data-spine-tick="list-04" /><i data-spine-tick="list-05" /><i data-spine-tick="cards" /><i data-spine-tick="stats" /></div><div className="case-number">01 / Flagship case</div><div className="case-copy"><div className="eyebrow"><span>Mission Mindfulness</span><i /></div><h2 data-case-beat="headline"><span>Growth work that</span><br /><span className="case-headline-italic"><em>reaches the whole system.</em></span></h2><p data-case-beat="lede">Worked across acquisition, product, content, automation and sales for a real learning business — connecting the creative idea to the systems that helped it travel.</p><div className="case-points" data-case-beat="list"><span data-case-beat="list-01" data-particle-node><b>01</b>Meta campaigns and performance iteration</span><span data-case-beat="list-02" data-particle-node><b>02</b>Scripts, creative concepts and video assets</span><span data-case-beat="list-03" data-particle-node><b>03</b>Website and AI-assisted workflows</span><span data-case-beat="list-04" data-particle-node><b>04</b>Lead generation, YouTube and social workflows</span><span data-case-beat="list-05" data-particle-node><b>05</b>Presentations, business assets and direct sales</span></div><div className="case-detail-grid" data-case-beat="cards" aria-label="Mission Mindfulness work delivered"><article data-particle-node><b>Acquisition</b><p>Campaign testing, creative iteration and performance-focused lead generation.</p></article><article data-particle-node><b>Build</b><p>Website structure and AI-assisted workflows that made the offer easier to understand and act on.</p></article><article data-particle-node><b>Execution</b><p>Scripts, video assets, social distribution and sales materials carried the same message across channels.</p></article></div><div className="case-workflow" aria-label="Mission Mindfulness workflow"><span><b>01</b><strong>Understand</strong><small>Audience, offer and friction</small></span><span><b>02</b><strong>Build</strong><small>Pages, assets and workflows</small></span><span><b>03</b><strong>Test</strong><small>Creative and campaign signals</small></span><span><b>04</b><strong>Improve</strong><small>Iteration across the system</small></span></div><EvidenceGallery /></div><ParticleArrivalStats /></section>
}

function SystemsAndApps() {
  const ref = useReveal()
  return <section className="systems-section" ref={ref}><div className="section-intro premium-reveal-intro"><RevealBlock className="premium-reveal-eyebrow"><div className="eyebrow"><span>Systems and applications</span><i className="premium-float" /></div></RevealBlock><h2><RevealWords text="I look for the friction," /><br /><RevealWords text="then build around it." as="em" /></h2><RevealLines className="systems-intro-note" lines={["Across these projects, the visible website is only one part of the work.", "I look for the moment where a real person gets confused, delayed or lost — then design", "the page, automation or workflow that makes the next step feel natural."]} /></div><div className="systems-grid"><article className="system-card" data-glow-card data-glow-hue="120"><span>01 / Bhutola Guest House</span><h3>QR + NFC review workflow</h3><p>Mapped a review journey with too many steps into a direct tap-to-web flow. Positive experiences could continue to the public review flow, while negative feedback was routed privately.</p><div className="system-card-result"><b>Why it mattered</b><span>Guests could respond in a few clear steps, while the business received a more useful feedback path.</span></div><small>Observed rating change: ~3.4 to ~3.8. Not claimed as solely caused by the system.</small></article><article className="system-card" data-glow-card data-glow-hue="30"><span>02 / Kakran Organic</span><h3>Wi-Fi order printing automation</h3><p>Connected incoming order information to scheduled printing, reducing repeated manual work in the order workflow.</p><div className="system-card-result"><b>Why it mattered</b><span>The website and the day-to-day operation were designed as one connected experience.</span></div><a href="https://kakranorganic.me/" target="_blank" rel="noreferrer">View project <ArrowUpRight size={16} /></a></article><article className="system-card trading-card" data-glow-card data-glow-hue="220"><span>03 / Product build</span><h3>Automated trading system</h3><p>Built independently in Python during Class 12, then iterated over several months. A version was sold to a client for about ₹50K.</p><div className="system-card-result"><b>Why it mattered</b><span>It was an early proof that I could learn a technical system deeply enough to deliver it to someone else.</span></div><small>Reported subsequent trading gains of ₹1.5L+ are separate from the client payment.</small></article></div></section>
}

const reels = [
  'https://www.instagram.com/reel/DdoCrIIxV4G/embed/captioned/',
  'https://www.instagram.com/reel/Ddn6oBpxEQW/embed/captioned/',
  'https://www.instagram.com/reel/Dc_ZS1czfMm/embed/captioned/',
]

function CreativeWork() {
  const ref = useReveal()
  return <section className="creative-section" id="creative" ref={ref}><div className="creative-heading"><div className="eyebrow"><span>Creative work</span><i /></div><h2>Editing that carries<br /><em>the idea forward.</em></h2><p>Video editing, social media and campaign assets are part of the same execution range.</p></div><div className="reel-grid">{reels.map((src, index) => <article className="reel-card" data-glow-card data-glow-hue={index === 0 ? '120' : index === 1 ? '280' : '30'} key={src}><div className="reel-top"><span>Reel 0{index + 1}</span><Play size={15} fill="currentColor" /></div><iframe src={src} title={'Edited Instagram reel ' + (index + 1)} loading="lazy" scrolling="no" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" /></article>)}</div></section>
}

function Range() {
  const ref = useReveal()
  return <section className="range-section"><div className="range-copy reveal-block" ref={ref}><div className="eyebrow"><span>Building range</span><i /></div><h2>Curious enough<br />to <em>cross the gap.</em></h2><p>Product, technology, growth, content, sales. The through-line is execution: learn the missing piece, then use it to move the project forward.</p><div className="range-list"><span>Web / product</span><span>AI / LLM</span><span>Automation</span><span>Growth</span><span>Sales</span><span>Creative</span></div><a className="text-link" href="mailto:kushagra44555@gmail.com">Let’s talk <ArrowUpRight size={18} /></a></div><DisplayCards /></section>
}

function buildProblemMailto(problem: string) {
  const subject = encodeURIComponent('A hard problem for you')
  const body = encodeURIComponent(problem.trim())
  return `mailto:kushagra44555@gmail.com?subject=${subject}${body ? `&body=${body}` : ''}`
}

function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const problemRef = useRef<HTMLSpanElement>(null)
  const problemText = useRef('')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reducedMotion.matches) return

    section.classList.add('is-magnetic')
    let frame = 0
    let pointer: { x: number; y: number } | null = null
    const update = () => {
      frame = 0
      if (!pointer) return
      const rect = section.getBoundingClientRect()
      section.style.setProperty('--spotlight-x', `${pointer.x - rect.left}px`)
      section.style.setProperty('--spotlight-y', `${pointer.y - rect.top}px`)
      section.querySelectorAll<HTMLElement>('.contact-action').forEach((button) => {
        const buttonRect = button.getBoundingClientRect()
        const centerX = buttonRect.left + buttonRect.width / 2
        const centerY = buttonRect.top + buttonRect.height / 2
        const dx = pointer!.x - centerX
        const dy = pointer!.y - centerY
        const distance = Math.hypot(dx, dy)
        const radius = 125
        const strength = distance < radius ? (1 - distance / radius) : 0
        button.style.setProperty('--mag-x', `${Math.max(-5, Math.min(5, dx * strength * .08))}px`)
        button.style.setProperty('--mag-y', `${Math.max(-5, Math.min(5, dy * strength * .08))}px`)
      })
    }
    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY }
      if (!frame) frame = requestAnimationFrame(update)
    }
    const reset = () => {
      pointer = null
      section.style.setProperty('--spotlight-x', '-300px')
      section.style.setProperty('--spotlight-y', '-300px')
      section.querySelectorAll<HTMLElement>('.contact-action').forEach((button) => {
        button.style.setProperty('--mag-x', '0px')
        button.style.setProperty('--mag-y', '0px')
      })
    }
    section.addEventListener('pointermove', onPointerMove)
    section.addEventListener('pointerleave', reset)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerleave', reset)
    }
  }, [])

  const onProblemInput = (event: React.FormEvent<HTMLSpanElement>) => {
    const node = event.currentTarget
    const value = (node.textContent ?? '').slice(0, 500)
    if (node.textContent !== value) node.textContent = value
    problemText.current = value
  }

  const sendProblem = () => {
    window.location.href = buildProblemMailto(problemText.current)
  }

  return <section className="contact-section" id="contact" ref={sectionRef}><div className="contact-top"><div className="eyebrow"><span>Next problem</span><i /></div><p>Have something messy, ambitious or half-formed?</p></div><div className="contact-prompt"><span className="contact-hint">click to type yours</span><h2><span>Give me a</span><br /><span className="contact-editable" contentEditable suppressContentEditableWarning role="textbox" aria-label="Describe your problem" aria-multiline="true" data-placeholder="hard problem." onInput={onProblemInput} ref={problemRef} /></h2></div><div className="contact-bottom"><div className="contact-actions"><button className="contact-action contact-send" type="button" onClick={sendProblem}><Mail size={18} /> Send it my way <ArrowUpRight size={15} /></button><a className="contact-action contact-action-email" href="mailto:kushagra44555@gmail.com"><Mail size={18} /> Email me <ArrowUpRight size={15} /></a><a className="contact-action contact-action-whatsapp" href="https://wa.me/918948765399?text=Hi%20Kushagra%2C%20I%27d%20like%20to%20discuss%20a%20project." target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp <ArrowUpRight size={15} /></a><a className="contact-action contact-action-github" href="https://github.com/kushagra5555" target="_blank" rel="noreferrer"><Code2 size={18} /> GitHub <ArrowUpRight size={15} /></a><a className="contact-action contact-action-linkedin" href="https://www.linkedin.com/in/kushagra-chaudhary-17a657419" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15} /></a></div></div></section>
}

function ScrollProgress() { const [progress, setProgress] = useState(0); useEffect(() => { let raf = 0; const update = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { const max = document.documentElement.scrollHeight - window.innerHeight; setProgress(max > 0 ? window.scrollY / max : 0) }) }; window.addEventListener('scroll', update, { passive: true }); update(); return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', update) } }, []); return <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" /> }

function App() { useSpotlightCards(); return <><SiteWideMotion /><ScrollProgress /><ScrollVideoHero /><main><PortfolioTimeline /><ScrollMorphWork /><FlagshipCase /><SystemsAndApps /><Proof /><Testimonials /><CreativeWork /><ConnectedExecution /><WorkingModelLoop /><Range /></main><Contact /><footer><span>© 2026 Kushagra Chaudhary</span><a href="#top">Back to top <ArrowUpRight size={14} /></a></footer></> }

export default function Root() { return <StrictMode><App /></StrictMode> }

createRoot(document.getElementById('root')!).render(<Root />)
