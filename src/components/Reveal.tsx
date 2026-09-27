import { useEffect, useRef, type ElementType, type ReactNode, type RefObject } from 'react'
import { REVEAL_CONFIG } from '../reveal'

function useRevealOnce() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      node.classList.add('site-reveal-visible')
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      node.classList.add('site-reveal-visible')
      observer.disconnect()
    }, { threshold: REVEAL_CONFIG.threshold })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return ref
}

export function RevealBlock({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRevealOnce()
  return <div className={`site-reveal ${className}`} ref={ref as RefObject<HTMLDivElement>}>{children}</div>
}

export function RevealWords({ text, className = '', as = 'span' }: { text: string; className?: string; as?: ElementType }) {
  const ref = useRevealOnce()
  const Tag = as
  return <Tag className={`site-reveal site-reveal-words ${className}`} ref={ref}>{text.split(' ').map((word, index) => <span className="site-reveal-piece" style={{ '--reveal-delay': `${index * REVEAL_CONFIG.staggerMs}ms` } as React.CSSProperties} key={`${word}-${index}`}>{word}{index < text.split(' ').length - 1 ? ' ' : ''}</span>)}</Tag>
}

export function RevealLines({ lines, className = '' }: { lines: string[]; className?: string }) {
  const ref = useRevealOnce()
  return <p className={`site-reveal site-reveal-lines ${className}`} ref={ref as RefObject<HTMLParagraphElement>}>{lines.map((line, index) => <span className="site-reveal-piece" style={{ '--reveal-delay': `${index * REVEAL_CONFIG.staggerMs}ms` } as React.CSSProperties} key={line}>{line}</span>)}</p>
}
