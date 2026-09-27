import { useEffect, useRef } from 'react'

type Point = { x: number; y: number }
type Particle = { start: Point; control: Point; end: Point; born: number; duration: number }

export default function ParticleArrivalStats() {
  const statsRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const stats = statsRef.current
    const canvas = canvasRef.current
    if (!stats || !canvas) return
    const section = stats.closest<HTMLElement>('.mission-case')
    const number = stats.querySelector<HTMLElement>('[data-count="leads"]')
    const cost = stats.querySelector<HTMLElement>('[data-count="cost"]')
    if (!section || !number || !cost) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const context = canvas.getContext('2d')
    if (!context) return
    const sources = Array.from(section.querySelectorAll<HTMLElement>('[data-particle-node]'))
    let animationFrame = 0
    let hasStarted = false
    let arrived = 0
    let value = 0
    const particles: Particle[] = []
    const timers: number[] = []
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const clear = () => context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    const bounce = () => {
      number.classList.remove('particle-number-bounce')
      void number.offsetWidth
      number.classList.add('particle-number-bounce')
    }
    const finish = () => {
      value = 1500
      number.textContent = '1,500+'
      stats.classList.add('case-stats-counted', 'case-secondary-revealed')
      clear()
    }
    const draw = (now: number) => {
      clear()
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index]
        const progress = Math.min(1, (now - particle.born) / particle.duration)
        const eased = 1 - Math.pow(1 - progress, 3)
        const inverse = 1 - eased
        const x = inverse * inverse * particle.start.x + 2 * inverse * eased * particle.control.x + eased * eased * particle.end.x
        const y = inverse * inverse * particle.start.y + 2 * inverse * eased * particle.control.y + eased * eased * particle.end.y
        const glow = context.createRadialGradient(x, y, 0, x, y, 12)
        glow.addColorStop(0, 'rgba(248,239,200,.98)')
        glow.addColorStop(.22, 'rgba(224,201,136,.9)')
        glow.addColorStop(1, 'rgba(224,201,136,0)')
        context.fillStyle = glow
        context.beginPath()
        context.arc(x, y, 12, 0, Math.PI * 2)
        context.fill()
        context.fillStyle = '#e0c988'
        context.beginPath()
        context.arc(x, y, 2.4, 0, Math.PI * 2)
        context.fill()
        if (progress >= 1) {
          particles.splice(index, 1)
          arrived += 1
          value = arrived === sources.length ? 1500 : Math.min(1500, value + Math.round(1500 / sources.length))
          number.textContent = `${value.toLocaleString()}+`
          bounce()
        }
      }
      if (particles.length || arrived < sources.length) animationFrame = requestAnimationFrame(draw)
      else finish()
    }
    const spawn = (source: HTMLElement, index: number, target: Point) => {
      const rect = source.getBoundingClientRect()
      const start = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      particles.push({ start, end: target, control: { x: (start.x + target.x) / 2 + (Math.random() - .5) * 100, y: Math.min(start.y, target.y) - 90 - Math.random() * 100 }, born: performance.now(), duration: 850 + Math.random() * 350 })
      if (index === 0) animationFrame = requestAnimationFrame(draw)
    }
    const start = () => {
      if (hasStarted) return
      hasStarted = true
      stats.classList.add('case-stats-counting')
      if (reduced || sources.length === 0) { finish(); return }
      resize()
      const targetRect = number.getBoundingClientRect()
      const target = { x: targetRect.left + targetRect.width / 2, y: targetRect.top + targetRect.height / 2 }
      sources.forEach((source, index) => timers.push(window.setTimeout(() => spawn(source, index, target), index * 175)))
    }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { start(); observer.disconnect() } }, { threshold: .15 })
    observer.observe(stats)
    resize()
    window.addEventListener('resize', resize)
    return () => { observer.disconnect(); timers.forEach(window.clearTimeout); cancelAnimationFrame(animationFrame); window.removeEventListener('resize', resize); clear() }
  }, [])

  return <div className="case-metrics particle-stats" ref={statsRef} data-case-beat="stats" data-case-stats><canvas className="particle-arrival-canvas" ref={canvasRef} aria-hidden="true" /><div className="case-metric-primary"><strong data-count="leads">1,500+</strong><span>reported leads generated</span></div><div className="case-metric-secondary"><strong data-count="cost">₹7–₹10</strong><span>approx. reported cost per result</span></div><a href="https://missionmindfulness.in/" target="_blank" rel="noreferrer">Visit live site ↗</a></div>
}
