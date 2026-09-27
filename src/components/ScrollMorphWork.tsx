import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

type Phase = 'scatter' | 'line' | 'circle' | 'arc'
type CardPosition = { x: number; y: number; rotation: number; scale: number; opacity: number }

const MAX_SCROLL = 3600
const WORK = [
  { name: 'Mission Mindfulness', image: '/work/mission-mindfulness.png', href: 'https://missionmindfulness.in/', position: 'center 34%' },
  { name: 'Kakran Organic', image: '/work/kakran-organic.png', href: 'https://kakranorganic.me/', position: 'center 30%' },
  { name: 'Hotel Ajanta', image: '/work/hotel-ajanta.png', href: 'https://www.hotelajanta.com/', position: 'center 35%' },
  { name: 'Butola Guest House', image: '/work/butola-guest-house.png', href: 'https://thebutolaguesthouses.tech/', position: 'center 42%' },
  { name: 'Yog Arogyadham', image: '/work/yog-arogyadham.png', href: 'https://yogaarogyadham.studio/', position: 'center 38%' },
]

const lerp = (start: number, end: number, amount: number) => start * (1 - amount) + end * amount

function positionFor(index: number, phase: Phase, width: number, height: number, scroll: number, mouseX: number): CardPosition {
  const count = WORK.length
  if (phase === 'scatter') return { x: (index % 2 ? 1 : -1) * (width * .4 + index * 80), y: (index - 2) * 180, rotation: (index % 2 ? 1 : -1) * (22 + index * 8), scale: .52, opacity: 0 }
  if (phase === 'line') return { x: (index - (count - 1) / 2) * 78, y: 0, rotation: index % 2 ? 2 : -2, scale: 1, opacity: 1 }
  const circleT = Math.min(scroll / (width < 700 ? 900 : 600), 1)
  const angle = (index / count) * Math.PI * 2 - Math.PI / 2
  const radius = Math.min(width, height) * .26
  const circle = { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, rotation: angle * 180 / Math.PI + 90 }
  const progress = Math.min(Math.max((scroll - (width < 700 ? 700 : 520)) / (MAX_SCROLL - (width < 700 ? 700 : 520)), 0), 1)
  const arcSpread = width < 700 ? 104 : 116
  const arcRadius = Math.min(width, height) * (width < 700 ? .25 : .38)
  const arcAngle = -90 - arcSpread / 2 + (index / (count - 1)) * arcSpread
  const arcRad = arcAngle * Math.PI / 180
  const arc = { x: Math.cos(arcRad) * arcRadius + mouseX, y: Math.sin(arcRad) * arcRadius + height * (width < 700 ? .22 : .58), rotation: arcAngle + 90 }
  return { x: lerp(circle.x, arc.x, circleT), y: lerp(circle.y, arc.y, circleT), rotation: lerp(circle.rotation, arc.rotation, circleT), scale: lerp(1, width < 700 ? 1.25 : 1.55, circleT), opacity: 1 }
}

export default function ScrollMorphWork() {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const scrollTarget = useRef(0)
  const scrollCurrent = useRef(0)
  const mouseTarget = useRef(0)
  const mouseCurrent = useRef(0)
  const [phase, setPhase] = useState<Phase>('scatter')
  const [size, setSize] = useState({ width: 0, height: 820 })
  const [visual, setVisual] = useState({ scroll: 0, mouseX: 0 })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const mediaFrame = frameRef.current
    if (!mediaFrame) return
    const resize = () => setSize({ width: mediaFrame.clientWidth, height: mediaFrame.clientHeight })
    const observer = new ResizeObserver(resize)
    observer.observe(mediaFrame)
    resize()
    const updateScroll = () => {
      const rect = section.getBoundingClientRect()
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(1, Math.max(0, -rect.top / travel))
      scrollTarget.current = progress * MAX_SCROLL
    }
    const move = (event: MouseEvent) => { const rect = mediaFrame.getBoundingClientRect(); mouseTarget.current = ((event.clientX - rect.left) / rect.width - .5) * 80 }
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    mediaFrame.addEventListener('mousemove', move)
    let raf = 0
    const mobile = window.matchMedia('(max-width: 700px)').matches
    const animate = () => { scrollCurrent.current += (scrollTarget.current - scrollCurrent.current) * (mobile ? .032 : .055); mouseCurrent.current += (mouseTarget.current - mouseCurrent.current) * .06; setVisual({ scroll: scrollCurrent.current, mouseX: mouseCurrent.current }); raf = requestAnimationFrame(animate) }
    raf = requestAnimationFrame(animate)
    return () => { observer.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('scroll', updateScroll); mediaFrame.removeEventListener('mousemove', move) }
  }, [])

  useEffect(() => { const mobile = window.matchMedia('(max-width: 700px)').matches; const line = window.setTimeout(() => setPhase('line'), mobile ? 900 : 500); const circle = window.setTimeout(() => setPhase('circle'), mobile ? 3600 : 2200); const arc = window.setTimeout(() => setPhase('arc'), mobile ? 5400 : 3000); return () => { window.clearTimeout(line); window.clearTimeout(circle); window.clearTimeout(arc) } }, [])
  const positions = useMemo(() => WORK.map((_, index) => positionFor(index, phase, size.width, size.height, visual.scroll, visual.mouseX)), [phase, size, visual])
  const introOpacity = Math.max(0, 1 - visual.scroll / 330)
  const detailOpacity = Math.min(1, Math.max(0, (visual.scroll - 520) / 350))

  return <section className="scroll-morph-work" ref={sectionRef} aria-label="Selected work">
    <div className="morph-frame" ref={frameRef}>
      <div className="morph-eyebrow">Selected work <span>05 projects</span></div>
      <div className="morph-intro" style={{ opacity: introOpacity }}><p>Selected <em>Work</em></p><span>Five client websites, systems &amp; automations <ArrowDownRight size={15} /></span></div>
      <div className="morph-detail" style={{ opacity: detailOpacity, transform: 'translateY(' + (20 - detailOpacity * 20) + 'px)' }}><span className="morph-statement">Real businesses / real systems / real execution</span><h2>Made to <em>move forward.</em></h2><p>Scroll through the work, then continue to the full portfolio.</p></div>
      <div className="morph-stage">{WORK.map((item, index) => { const card = positions[index]; return <a className="morph-card" href={item.href} target="_blank" rel="noreferrer" key={item.name} style={{ transform: 'translate3d(calc(-50% + ' + card.x + 'px), calc(-50% + ' + card.y + 'px), 0) rotate(' + card.rotation + 'deg) scale(' + card.scale + ')', opacity: card.opacity }}><img src={item.image} alt={item.name + ' website'} style={{ objectPosition: item.position }} /><span className="morph-card-label">{item.name}<ArrowUpRight size={13} /></span></a> })}</div>
      <div className="morph-progress"><span style={{ transform: 'scaleX(' + (visual.scroll / MAX_SCROLL) + ')' }} /></div>
    </div>
  </section>
}
