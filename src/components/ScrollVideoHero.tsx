import { useEffect, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export default function ScrollVideoHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)
  const readyRef = useRef(false)
  const [mobile, setMobile] = useState(() => window.innerWidth < 768)
  const [ready, setReady] = useState(false)
  const source = mobile ? '/hero-mobile.mp4' : '/hero-desktop.mp4'

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    let timer = 0
    const update = () => { window.clearTimeout(timer); timer = window.setTimeout(() => setMobile(query.matches), 120) }
    query.addEventListener('change', update)
    return () => { window.clearTimeout(timer); query.removeEventListener('change', update) }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    setReady(false)
    readyRef.current = false
    video.pause()
    video.src = source
    video.load()
    const kickstart = () => { const play = video.play(); if (play) play.then(() => video.pause()).catch(() => {}) }
    video.addEventListener('canplay', kickstart, { once: true })
    return () => video.removeEventListener('canplay', kickstart)
  }, [source])

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let duration = 0
    let target = 0
    let current = 0
    let lastFrameTime = performance.now()
    let isSeeking = false
    let pendingTime: number | null = null
    let seekBurstWarned = false
    let locked = false
    let released = false
    let exitRequested = false
    let exitTimer = 0
    let releaseUntil = 0
    let lockedY = 0
    let touchY = 0
    let raf = 0
    let lastWord = -2
    // A phone swipe covers less physical distance than a desktop wheel burst.
    // Use a shorter scrub distance on touch devices so the hero advances
    // decisively without requiring repeated hard swipes.
    const scrubDistance = mobile ? 1000 : 2800
    const words = ['IMAGINE', 'BUILD', 'CONNECT', 'ITERATE', 'MOVE']
    const priorBodyStyle = document.body.getAttribute('style')

    const lock = () => {
      if (locked || reduced) return
      locked = true
      lockedY = window.scrollY
      Object.assign(document.body.style, { position: 'fixed', top: `-${lockedY}px`, left: '0', right: '0', width: '100%', height: '100%', overscrollBehavior: 'none' })
    }
    const unlock = () => {
      if (!locked) return
      locked = false
      if (priorBodyStyle === null) document.body.removeAttribute('style')
      else document.body.setAttribute('style', priorBodyStyle)
      window.scrollTo(0, lockedY)
    }
    const release = () => {
      if (released) return
      released = true
      releaseUntil = Date.now() + 900
      unlock()
      window.requestAnimationFrame(() => window.scrollTo({ top: section.offsetTop + section.offsetHeight, behavior: 'smooth' }))
    }
    const requestExit = () => {
      if (exitRequested || released) return
      exitRequested = true
      exitTimer = window.setTimeout(() => { exitTimer = 0; if (current >= .985) release(); else exitRequested = false }, 520)
    }
    const seek = (time: number) => {
      if (!readyRef.current) return
      if (isSeeking) {
        pendingTime = time
        if (import.meta.env.DEV && !seekBurstWarned) {
          console.debug('[hero] collapsed a burst of scrub seeks to the latest target')
          seekBurstWarned = true
        }
        return
      }
      isSeeking = true
      video.currentTime = time
    }
    const onSeeked = () => {
      isSeeking = false
      if (pendingTime !== null) {
        const time = pendingTime
        pendingTime = null
        seek(time)
      }
    }
    const markReady = () => {
      duration = video.duration || 0
      const enoughData = video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA
      readyRef.current = enoughData
      setReady(enoughData)
      if (reduced && duration) { target = 1; current = 1; video.currentTime = duration * .92 }
    }
    const onLoaded = () => markReady()
    const onCanPlayThrough = () => markReady()
    const addDelta = (delta: number) => {
      if (!locked || !readyRef.current) return
      if (delta < 0) { exitRequested = false; window.clearTimeout(exitTimer) }
      if (target >= .998 && delta > 0) { requestExit(); return }
      target = clamp(target + delta / scrubDistance, 0, 1)
      if (target >= .998 && delta > 0) requestExit()
    }
    const onWheel = (event: WheelEvent) => { if (!locked) return; event.preventDefault(); addDelta(event.deltaY) }
    const onTouchStart = (event: TouchEvent) => { touchY = event.touches[0]?.clientY ?? 0 }
    const onTouchMove = (event: TouchEvent) => { if (!locked) return; const y = event.touches[0]?.clientY ?? touchY; event.preventDefault(); addDelta(touchY - y); touchY = y }
    const onScroll = () => {
      if (!released && !locked && !reduced && window.scrollY <= 1 && Date.now() > releaseUntil) { target = 1; current = 1; lock() }
    }
    const frame = () => {
      const now = performance.now()
      const deltaTime = Math.min(.1, Math.max(.001, (now - lastFrameTime) / 1000))
      lastFrameTime = now
      const smoothing = 1 - Math.exp(-10 * deltaTime)
      current += (target - current) * smoothing
      if (!reduced && duration) {
        const nextTime = current * duration
        if (Math.abs(video.currentTime - nextTime) > .045) seek(nextTime)
      }
      const title = titleRef.current
      const tagline = taglineRef.current
      const progress = progressRef.current
      if (title) { const shown = 1 - clamp((current - .16) / .34, 0, 1); title.style.opacity = String(shown); title.style.transform = `translateY(${(1 - shown) * -26}px)`; title.style.filter = `blur(${(1 - shown) * 9}px)` }
      if (tagline) { const shown = clamp((current - .42) / .36, 0, 1); tagline.style.opacity = String(shown); tagline.style.transform = `translateY(${(1 - shown) * 18}px)`; tagline.style.filter = `blur(${(1 - shown) * 7}px)` }
      if (progress) progress.style.transform = `scaleX(${current})`
      if (wordRef.current) {
        const wordReady = current >= .52
        const word = wordReady ? Math.min(words.length - 1, Math.floor(clamp((current - .52) / .48, 0, 1) * words.length)) : -1
        wordRef.current.style.opacity = wordReady ? '1' : '0'
        if (word !== lastWord) {
          lastWord = word
          wordRef.current.textContent = wordReady ? words[word] : ''
          wordRef.current.classList.remove('word-pop')
          if (wordReady) { void wordRef.current.offsetWidth; wordRef.current.classList.add('word-pop') }
        }
      }
      if (target >= .998 && current >= .985 && !exitRequested) requestExit()
      raf = requestAnimationFrame(frame)
    }

    video.addEventListener('loadeddata', onLoaded)
    video.addEventListener('canplaythrough', onCanPlayThrough)
    video.addEventListener('seeked', onSeeked)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    lock()
    raf = requestAnimationFrame(frame)
    return () => { video.removeEventListener('loadeddata', onLoaded); video.removeEventListener('canplaythrough', onCanPlayThrough); video.removeEventListener('seeked', onSeeked); window.removeEventListener('wheel', onWheel); window.removeEventListener('touchstart', onTouchStart); window.removeEventListener('touchmove', onTouchMove); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); unlock() }
  }, [source])

  return <section className="video-hero" ref={sectionRef} id="top" aria-label="Kushagra Chaudhary introduction">
    <video className="video-hero-media" ref={videoRef} muted playsInline preload="auto" aria-hidden="true" style={{ opacity: ready ? 1 : 0 }} />
    <div className="video-hero-shade" />
    <nav className="video-hero-nav"><a href="#top" className="video-brand"><span>K</span><b>KC</b></a><div><a href="#work">Work</a><a href="#creative">Creative</a><a href="#contact">Contact</a></div></nav>
    <div className="video-hero-kicker">AI / Product / Automation / Growth</div>
    <div className="video-hero-copy"><div ref={titleRef}><h1>Kushagra<br />Chaudhary</h1></div><p ref={taglineRef}>I find the business problem first, learn what is necessary, build the solution, deploy it, measure it, and iterate.</p></div>
    <div className="video-hero-word" aria-live="polite"><span ref={wordRef} /></div>
    <div className="video-hero-mark" aria-label="KC monogram">KC</div>
    <div className="video-scroll-hint"><span>Scroll to enter</span><ArrowDown size={15} /></div>
    <div className="video-hero-progress"><span ref={progressRef} /></div>
  </section>
}
