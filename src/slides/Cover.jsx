import { Mark2, Stars } from '../components/ui.jsx'
import { SECTIONS } from '../sections.js'

export default function Cover() {
  return (
    <section id="top" className="slide cover" data-slide data-section="0">
      <div className="panel cover-panel">
        <p className="cover-stars">
          <Stars value={3} label="Three stars" />
        </p>
        <h1>
          Our <Mark2>Rating System</Mark2>
        </h1>
        <p className="lede">
          Rawd Khaldoun, Amr Al-Sakaji, Ammar, Hala Al-Dayyeh
        </p>
        <ol className="agenda">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>
                <span className="agenda-num">{section.number}</span>
                <span>{section.title}</span>
              </a>
            </li>
          ))}
        </ol>
        <p className="hint">Use ← → or space to move through the slides</p>
      </div>
    </section>
  )
}
