import harary from '../assets/frank-harary.jpg'
import { Formula, Mark2, Opener, Slide, Stars } from '../components/ui.jsx'

const NODES = {
  A: [90, 90],
  B: [250, 60],
  C: [170, 230],
  D: [470, 80],
  E: [560, 230],
  F: [390, 260],
}

const EDGES = [
  ['A', 'B', 1],
  ['B', 'A', 1],
  ['B', 'C', 1],
  ['C', 'A', 1],
  ['D', 'E', 1],
  ['E', 'F', 1],
  ['F', 'D', 1],
  ['B', 'D', -1],
  ['C', 'F', -1],
  ['A', 'C', 0],
]

const RADIUS = 24

// Bends each edge slightly so A→B and B→A sit side by side.
function edgePath([x1, y1], [x2, y2]) {
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.hypot(dx, dy)
  const ux = dx / length
  const uy = dy / length
  const px = -uy
  const py = ux
  const bend = 16
  const shift = 6
  const gap = RADIUS + 7
  const cx = (x1 + x2) / 2 + px * bend
  const cy = (y1 + y2) / 2 + py * bend
  const start = `${x1 + ux * gap + px * shift} ${y1 + uy * gap + py * shift}`
  const end = `${x2 - ux * gap + px * shift} ${y2 - uy * gap + py * shift}`
  return `M${start} Q${cx} ${cy} ${end}`
}

function SignedGraph() {
  return (
    <svg className="graph" viewBox="0 0 640 320" role="img" aria-label="Six students joined by directed positive, negative and neutral rating edges">
      <defs>
        {[
          ['pos', 'var(--sun)'],
          ['neg', 'var(--paper)'],
          ['zero', 'var(--mute-dark)'],
        ].map(([id, color]) => (
          <marker key={id} id={`arrow-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill={color} />
          </marker>
        ))}
      </defs>
      {EDGES.map(([from, to, sign]) => {
        const kind = sign > 0 ? 'pos' : sign < 0 ? 'neg' : 'zero'
        return (
          <path
            key={from + to}
            className={`edge edge-${kind}`}
            d={edgePath(NODES[from], NODES[to])}
            markerEnd={`url(#arrow-${kind})`}
          />
        )
      })}
      {Object.entries(NODES).map(([name, [x, y]]) => (
        <g key={name}>
          <circle className="node" cx={x} cy={y} r={RADIUS} />
          <text className="node-label" x={x} y={y + 6} textAnchor="middle">
            {name}
          </text>
        </g>
      ))}
    </svg>
  )
}

const TRIADS = [
  { signs: [1, 1, 1], read: 'All friends' },
  { signs: [1, -1, -1], read: 'Two friends, one shared enemy' },
  { signs: [1, 1, -1], read: 'A friend’s friend is an enemy' },
  { signs: [-1, -1, -1], read: 'Three mutual enemies' },
]

function Triad({ signs, read }) {
  const points = [
    [50, 10],
    [90, 80],
    [10, 80],
  ]
  const balanced = signs[0] * signs[1] * signs[2] > 0
  return (
    <figure className="triad">
      <svg viewBox="0 0 100 90" role="img" aria-label={`${read}: ${balanced ? 'balanced' : 'unbalanced'}`}>
        {points.map(([x, y], i) => {
          const [x2, y2] = points[(i + 1) % 3]
          const positive = signs[i] > 0
          return (
            <g key={i}>
              <line className={positive ? 'tri-pos' : 'tri-neg'} x1={x} y1={y} x2={x2} y2={y2} />
              <circle className="tri-sign-bg" cx={(x + x2) / 2} cy={(y + y2) / 2} r="8" />
              <text className="tri-sign" x={(x + x2) / 2} y={(y + y2) / 2 + 4} textAnchor="middle">
                {positive ? '+' : '−'}
              </text>
            </g>
          )
        })}
        {points.map(([x, y]) => (
          <circle key={`${x}${y}`} className="tri-node" cx={x} cy={y} r="6" />
        ))}
      </svg>
      <figcaption>
        <strong>{balanced ? 'Balanced' : 'Unbalanced'}</strong>
        {read}
      </figcaption>
    </figure>
  )
}

const RATERS = [
  [80, 'Rater 1'],
  [560, 'Rater 2'],
]
const TARGETS = [
  [100, 'T1', '★★★'],
  [180, 'T2', '★'],
  [260, 'T3', '★★★'],
]

function ImplicitEdge() {
  return (
    <svg className="graph" viewBox="0 0 640 310" role="img" aria-label="Two raters give the same ratings to three targets, which creates an implicit edge between them">
      <path className="edge edge-implicit" d="M80 152 C130 10 510 10 560 152" />
      <text className="graph-note" x="320" y="28" textAnchor="middle">implicit edge</text>
      {RATERS.flatMap(([x]) =>
        TARGETS.map(([y, name, stars]) => (
          <g key={`${x}${name}`}>
            <line className="edge edge-pos" x1={x} y1="180" x2="320" y2={y} />
            <text className="edge-stars" x={x + (320 - x) * 0.62} y={180 + (y - 180) * 0.62 + 5} textAnchor="middle">
              {stars}
            </text>
          </g>
        )),
      )}
      {RATERS.map(([x, name]) => (
        <g key={name}>
          <rect className="node" x={x - 44} y="156" width="88" height="48" rx="10" />
          <text className="node-label small" x={x} y="185" textAnchor="middle">{name}</text>
        </g>
      ))}
      {TARGETS.map(([y, name]) => (
        <g key={name}>
          <circle className="node" cx="320" cy={y} r="24" />
          <text className="node-label small" x="320" y={y + 5} textAnchor="middle">{name}</text>
        </g>
      ))}
    </svg>
  )
}

export default function Network() {
  return (
    <>
      <Opener section="network" />

      <Slide section="network" title="A signed, directed graph">
        <div className="split">
          <div className="stack">
            <p className="body">
              Each rating is an <Mark2>edge from rater to target</Mark2> with a sign.
            </p>
            <table className="map">
              <caption>Stars to sign, per rating</caption>
              <tbody>
                {[
                  [1, '−1'],
                  [2, '0'],
                  [3, '+1'],
                ].map(([stars, sign]) => (
                  <tr key={stars}>
                    <td><Stars value={stars} /></td>
                    <td className="arrow">→</td>
                    <td className="sign">{sign}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="body">
              Accumulated with <strong>time decay</strong>, these give you a tie strength{' '}
              <code>s(A→B)</code>.
            </p>
          </div>
          <div className="card-dark">
            <SignedGraph />
            <ul className="legend">
              <li><i className="key key-pos" /> Positive</li>
              <li><i className="key key-neg" /> Negative</li>
              <li><i className="key key-zero" /> Neutral</li>
            </ul>
          </div>
        </div>
      </Slide>

      <Slide section="network" title="Symmetrize for proximity">
        <Formula note="Plus a bonus when both directions are positive.">
          s(A,B) = s(A→B) + s(B→A)
        </Formula>
        <div className="pair">
          <div className="card">
            <p className="tag">One-way</p>
            <p className="ties">A <span className="tie">→</span> B</p>
            <p className="pair-calc">(+2) + 0 = 2</p>
            <p>A rates B highly. B doesn’t reciprocate. No bonus.</p>
          </div>
          <div className="card card-sun">
            <p className="tag">Mutual</p>
            <p className="ties">A <span className="tie">⇄</span> B</p>
            <p className="pair-calc">(+2) + (+2) = 4 + bonus</p>
            <p>
              Mutual high ratings are a <strong>stronger “friend” signal</strong> than one-way, so
              the pair earns the bonus.
            </p>
          </div>
        </div>
      </Slide>

      <Slide section="network" title="Thing to watch 1: structural balance" className="harary">
        <div className="harary-grid">
          <figure className="portrait">
            <img src={harary} alt="Black and white portrait of Frank Harary, an older man in glasses, a jacket and a striped tie, in front of bookshelves" />
            <figcaption>
              <strong>Frank Harary</strong>
              Structural balance theory, with Dorwin Cartwright
            </figcaption>
          </figure>
          <div className="stack">
            <p className="body">
              <Mark2>Structural balance theory</Mark2> (Cartwright–Harary) and signed community
              detection both apply here.
            </p>
            <p className="body">
              <strong>Don’t collapse negatives into “large distance”</strong> or you lose the
              signal. Negative edges carry meaning that an ordinary distance can’t.
            </p>
            <div className="triads">
              {TRIADS.map((triad) => (
                <Triad key={triad.read} {...triad} />
              ))}
            </div>
          </div>
        </div>
      </Slide>

      <Slide section="network" title="Thing to watch 2: implicit edges">
        <div className="split">
          <div className="stack">
            <p className="body big">
              Two raters who repeatedly rate the same targets the same way{' '}
              <Mark2>get an implicit edge</Mark2>.
            </p>
            <p className="body">They don’t need to have rated each other. Their matching votes connect them.</p>
          </div>
          <div className="card-dark">
            <ImplicitEdge />
          </div>
        </div>
      </Slide>
    </>
  )
}
