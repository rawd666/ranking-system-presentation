import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Mark } from './components/ui.jsx'
import { SECTIONS } from './sections.js'
import Cover from './slides/Cover.jsx'
import Network from './slides/Network.jsx'
import RandomVotes from './slides/RandomVotes.jsx'
import NegativeFlag from './slides/NegativeFlag.jsx'
import VoteCap from './slides/VoteCap.jsx'
import Score from './slides/Score.jsx'

const FORWARD = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' '])
const BACK = new Set(['ArrowLeft', 'ArrowUp', 'PageUp'])

function scrollToSlide(slide) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  slide?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

function useSlides() {
  const [current, setCurrent] = useState({ index: 0, total: 1, section: 0 })
  const slides = useRef([])
  const index = useRef(0)

  useEffect(() => {
    slides.current = [...document.querySelectorAll('[data-slide]')]
    const total = slides.current.length
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          index.current = slides.current.indexOf(entry.target)
          setCurrent({
            index: index.current,
            total,
            section: Number(entry.target.dataset.section),
          })
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    slides.current.forEach((slide) => observer.observe(slide))
    return () => observer.disconnect()
  }, [])

  const go = useCallback((delta) => {
    scrollToSlide(slides.current[index.current + delta])
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      const tag = event.target.tagName
      if (tag === 'INPUT' || (tag === 'BUTTON' && event.key === ' ')) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (FORWARD.has(event.key) && !event.shiftKey) {
        event.preventDefault()
        go(1)
      } else if (BACK.has(event.key) || (event.key === ' ' && event.shiftKey)) {
        event.preventDefault()
        go(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  return { current, go }
}

function Tabs({ active }) {
  const tabs = useRef([])
  const [bar, setBar] = useState(null)

  useLayoutEffect(() => {
    const measure = () => {
      const tab = tabs.current[active - 1]
      setBar(tab ? { left: tab.offsetLeft, width: tab.offsetWidth } : null)
    }
    measure()
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  return (
    <div className="tabs">
      <span
        className="tab-bar"
        style={bar ? { width: bar.width, transform: `translateX(${bar.left}px)` } : { opacity: 0 }}
      />
      {SECTIONS.map((section, i) => (
        <a
          key={section.id}
          ref={(el) => (tabs.current[i] = el)}
          href={`#${section.id}`}
          className="tab"
          aria-current={active === i + 1 ? 'true' : undefined}
          onClick={(event) => {
            event.preventDefault()
            scrollToSlide(document.getElementById(section.id))
          }}
        >
          <span className="tab-num">{section.number}</span>
          <span className="tab-label">{section.tab}</span>
        </a>
      ))}
    </div>
  )
}

export default function App() {
  const { current, go } = useSlides()
  const progress = current.total > 1 ? current.index / (current.total - 1) : 0

  return (
    <>
      <header className="nav">
        <a
          className="brand"
          href="#top"
          onClick={(event) => {
            event.preventDefault()
            scrollToSlide(document.getElementById('top'))
          }}
        >
          <Mark />
          <span>Rating system</span>
        </a>
        <nav aria-label="Requirements">
          <Tabs active={current.section} />
        </nav>
        <div className="pager">
          <span className="pager-count">
            {current.index + 1} / {current.total}
          </span>
          <button type="button" aria-label="Previous slide" onClick={() => go(-1)}>
            ←
          </button>
          <button type="button" className="primary" aria-label="Next slide" onClick={() => go(1)}>
            →
          </button>
        </div>
        <span className="progress" style={{ transform: `scaleX(${progress})` }} />
      </header>
      <main>
        <Cover />
        <Network />
        <RandomVotes />
        <NegativeFlag />
        <VoteCap />
        <Score />
      </main>
    </>
  )
}
