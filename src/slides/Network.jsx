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
    </>
  )
}
