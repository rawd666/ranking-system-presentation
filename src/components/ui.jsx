import { useId } from 'react'
import { SECTIONS, sectionById } from '../sections.js'

const STAR_PATH = 'M10.82,3.82Q12.00,1.50,13.18,3.82L14.76,6.93Q15.35,8.09,16.63,8.29L20.08,8.83Q22.65,9.24,20.81,11.08L18.34,13.54Q17.42,14.46,17.63,15.75L18.17,19.19Q18.58,21.76,16.27,20.58L13.16,18.99Q12.00,18.40,10.84,18.99L7.73,20.58Q5.42,21.76,5.83,19.19L6.37,15.75Q6.58,14.46,5.66,13.54L3.19,11.08Q1.35,9.24,3.92,8.83L7.37,8.29Q8.65,8.09,9.24,6.93Z'

export function Mark() {
  return (
    <svg className="mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d={STAR_PATH} />
    </svg>
  )
}

export function Star({ fill = 1 }) {
  const id = useId()
  return (
    <svg className="star" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={24 * fill} height="24" />
        </clipPath>
      </defs>
      <path className="star-empty" d={STAR_PATH} />
      <path className="star-fill" d={STAR_PATH} clipPath={`url(#${id})`} />
    </svg>
  )
}

// value may be fractional: 2.33 draws two full stars and a third of the last.
export function Stars({ value, max = 3, label }) {
  return (
    <span className="stars" role="img" aria-label={label ?? `${value} of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <Star key={i} fill={Math.max(0, Math.min(1, value - i))} />
      ))}
    </span>
  )
}

export function Mark2({ children }) {
  return <span className="hl">{children}</span>
}

export function Opener({ section: id }) {
  const section = sectionById(id)
  return (
    <section id={id} className="slide opener" data-slide data-section={section.number}>
      <div className="panel panel-dark opener-panel">
        <p className="tag tag-accent">
          Requirement {section.number} of {String(SECTIONS.length).padStart(2, '0')}
        </p>
        <div className="opener-body">
          <span className="opener-num" aria-hidden="true">
            {section.number}
          </span>
          <div>
            <h2>{section.title}</h2>
            <p className="lede">{section.summary}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Slide({ section: id, title, intro, children, className = '' }) {
  const section = sectionById(id)
  return (
    <section className={`slide ${className}`} data-slide data-section={section.number}>
      <div className="panel">
        <p className="crumb">
          <span className="crumb-num">{section.number}</span>
          {section.title}
        </p>
        <h3>{title}</h3>
        {intro && <p className="intro">{intro}</p>}
        <div className="slide-body">{children}</div>
      </div>
    </section>
  )
}

export function Formula({ children, note }) {
  return (
    <div className="formula">
      <code>{children}</code>
      {note && <p>{note}</p>}
    </div>
  )
}

export function Slider({ label, value, min, max, step = 1, onChange, format = (v) => v }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <label className="slider">
      <span className="slider-head">
        <span>{label}</span>
        <output>{format(value)}</output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ '--pct': `${pct}%` }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}
