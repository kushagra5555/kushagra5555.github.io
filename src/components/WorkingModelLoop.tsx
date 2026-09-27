import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, RotateCcw } from 'lucide-react'

const stages = [
  ['01', 'Understand', 'What is the actual business problem?'],
  ['02', 'Build', 'What is the fastest useful prototype?'],
  ['03', 'Test', 'What happens when it meets reality?'],
  ['04', 'Learn', 'What failed, and what knowledge is missing?'],
  ['05', 'Improve', 'What should change in the next iteration?'],
] as const

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])
  return reduced
}

export default function WorkingModelLoop() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStage, setActiveStage] = useState(0)
  const [leavingStage, setLeavingStage] = useState<number | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return
    let raf = 0
    let lastIndex = -1
    const update = () => {
      const rect = section.getBoundingClientRect()
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(1, Math.max(0, -rect.top / travel))
      // Six beats: five stages, then a deliberate wrap to stage 01 before release.
      const beat = Math.min(5, Math.floor(progress * 6))
      const nextIndex = beat === 5 ? 0 : beat
      if (nextIndex !== lastIndex) {
        if (lastIndex >= 0) setLeavingStage(lastIndex)
        setActiveStage(nextIndex)
        lastIndex = nextIndex
      }
      section.style.setProperty('--model-progress', String(progress))
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  useEffect(() => {
    if (leavingStage === null) return
    const timeout = window.setTimeout(() => setLeavingStage(null), 420)
    return () => window.clearTimeout(timeout)
  }, [leavingStage, activeStage])

  if (reduced) {
    return <section className="model-loop model-loop-reduced" id="model" aria-label="The working model"><div className="model-loop-heading"><div className="eyebrow"><span>The working model</span><i /></div><h2>Understand → build<br /><em>→ test → improve.</em></h2></div><div className="model-loop-list">{stages.map(([number, title, question]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{question}</p></div></article>)}</div></section>
  }

  const current = stages[activeStage]
  const previous = leavingStage === null ? null : stages[leavingStage]

  return <section className="model-loop" id="model" ref={sectionRef} aria-label="The working model scroll loop">
    <div className="model-loop-pin">
      <div className="model-loop-heading"><div className="eyebrow"><span>The working model</span><i /></div><h2>Understand → build<br /><em>→ test → improve.</em></h2><p>Scroll through the loop. Each stage turns the last question into the next useful action.</p></div>
      <div className="model-loop-stage" aria-live="polite">
        {previous && <div className="model-stage-copy model-stage-exit"><span>{previous[0]}</span><h3>{previous[1]}</h3><p>{previous[2]}</p></div>}
        <div className="model-stage-copy model-stage-enter" key={current[0]}><span>{current[0]}</span><h3>{current[1]}</h3><p>{current[2]}</p></div>
      </div>
      <div className="model-loop-orbit" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className="model-loop-progress" aria-label={`Stage ${current[0]} of 5`}><div>{stages.map(([number], index) => <span className={index === activeStage ? 'is-active' : ''} key={number}>{number}</span>)}</div><small>{activeStage === 0 && leavingStage === 4 ? 'Looping back to the problem' : 'Scroll to continue the loop'}</small></div>
      <div className="model-loop-release"><RotateCcw size={15} /> The loop repeats before the next section</div>
      <ArrowDownRight className="model-loop-arrow" size={22} aria-hidden="true" />
    </div>
  </section>
}
