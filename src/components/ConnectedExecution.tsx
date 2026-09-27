import { useEffect, useRef, useState } from 'react'
import { Bot, Code2, Megaphone, Video, Workflow } from 'lucide-react'

const nodes = [
  { id: 'web', label: 'Web', proof: 'Websites and product surfaces make the next step clear.', icon: Code2, className: 'node-web', path: 'M320 200 L130 92' },
  { id: 'ai', label: 'AI', proof: 'AI-assisted systems reduce repetition and expand what one person can execute.', icon: Bot, className: 'node-ai', path: 'M320 200 L510 76' },
  { id: 'automation', label: 'Automation', proof: 'Workflows connect the promise on the page to what happens behind it.', icon: Workflow, className: 'node-automation', path: 'M320 200 L106 286' },
  { id: 'growth', label: 'Growth', proof: 'Campaigns, content and measurement turn attention into movement.', icon: Megaphone, className: 'node-growth', path: 'M320 200 L522 280' },
  { id: 'creative', label: 'Creative', proof: 'Scripts, edits and visual rhythm carry the idea forward.', icon: Video, className: 'node-creative', path: 'M320 200 L320 350' },
]

export default function ConnectedExecution() {
  const sectionRef = useRef<HTMLElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const [activeNode, setActiveNode] = useState<string | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const visual = visualRef.current
    if (!section || !visual) return
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer.matches || reduced) return
    let raf = 0
    let targetX = 0
    let targetY = 0
    let tiltX = 0
    let tiltY = 0
    const paint = () => {
      raf = 0
      tiltX += (targetX - tiltX) * .12
      tiltY += (targetY - tiltY) * .12
      visual.style.setProperty('--tilt-x', `${tiltX}deg`)
      visual.style.setProperty('--tilt-y', `${tiltY}deg`)
      if (Math.abs(targetX - tiltX) > .02 || Math.abs(targetY - tiltY) > .02) raf = requestAnimationFrame(paint)
    }
    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      targetY = ((event.clientX - (rect.left + rect.width / 2)) / rect.width) * 4
      targetX = -((event.clientY - (rect.top + rect.height / 2)) / rect.height) * 4
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const reset = () => { targetX = 0; targetY = 0; if (!raf) raf = requestAnimationFrame(paint) }
    section.addEventListener('pointermove', onMove, { passive: true })
    section.addEventListener('pointerleave', reset, { passive: true })
    return () => { if (raf) cancelAnimationFrame(raf); section.removeEventListener('pointermove', onMove); section.removeEventListener('pointerleave', reset) }
  }, [])

  return <section className="connected-execution" ref={sectionRef} aria-labelledby="connected-execution-title"><div className="connected-execution-copy"><div className="eyebrow"><span>Connected execution</span><i /></div><h2 id="connected-execution-title">One idea,<br /><em>many useful systems.</em></h2><p>The strongest work happens when the visible experience and the work behind it are designed as one connected system.</p><span className="connected-execution-instruction">Hover or tab through a node to see its role.</span></div><div className="connected-execution-visual" ref={visualRef}><div className="connected-execution-ring" aria-hidden="true" /><div className="connected-execution-particles" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</div><svg viewBox="0 0 640 400" aria-hidden="true">{nodes.map((node) => <g key={node.id} className={`connected-path-group ${activeNode && activeNode !== node.id ? 'is-muted' : ''}`}><path d={node.path} className="connected-path" /><path d={node.path} className="connected-pulse connected-pulse-lead" /><path d={node.path} className="connected-pulse connected-pulse-tail connected-pulse-tail-one" /><path d={node.path} className="connected-pulse connected-pulse-tail connected-pulse-tail-two" /></g>)}</svg><div className="connected-execution-hub"><span>KC</span><small>BUILD</small></div>{nodes.map(({ id, label, proof, icon: Icon, className }) => <button key={id} type="button" className={`connected-node ${className} ${activeNode && activeNode !== id ? 'is-muted' : ''} ${activeNode === id ? 'is-active' : ''}`} onMouseEnter={() => setActiveNode(id)} onMouseLeave={() => setActiveNode(null)} onFocus={() => setActiveNode(id)} onBlur={() => setActiveNode(null)} onClick={() => setActiveNode(activeNode === id ? null : id)} aria-pressed={activeNode === id}><span className="connected-node-icon"><Icon size={21} /></span><span className="connected-node-label">{label}</span><b className="connected-node-proof">{proof}</b></button>)}</div></section>
}
