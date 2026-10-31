import { useState } from 'react'
import { Formula, Mark2, Opener, Slide, Slider, Stars } from '../components/ui.jsx'

const THRESHOLD = -2.5
const SIGMA = 0.7

const signed = (value, digits = 2) => {
  const text = Math.abs(value).toFixed(digits)
  return `${value < 0 ? '−' : '+'}${text}`
}
const zScore = (bias, n, sigma = SIGMA) => bias / (sigma / Math.sqrt(n))

const VOTES = [
  { target: 'Target 1', score: 1, others: 2.8 },
  { target: 'Target 2', score: 1, others: 2.4 },
  { target: 'Target 3', score: 2, others: 2.6 },
  { target: 'Target 4', score: 1, others: 1.2 },
  { target: 'Target 5', score: 2, others: 2.9 },
].map((vote) => ({ ...vote, residual: vote.score - vote.others }))

const WORKED_BIAS = VOTES.reduce((sum, vote) => sum + vote.residual, 0) / VOTES.length
const WORKED_SE = SIGMA / Math.sqrt(VOTES.length)
const WORKED_Z = WORKED_BIAS / WORKED_SE

const COMPARE = [
  { name: 'Three unlucky votes', n: 3, bias: -1 },
  { name: 'Fifty harsh votes', n: 50, bias: -1 },
  { name: 'Fair rater', n: 40, bias: -0.05 },
]

function Bell({ z }) {
  const WIDTH = 560
  const HEIGHT = 190
  const BASE = 160
  const RANGE = 5
  const x = (value) => ((value + RANGE) / (2 * RANGE)) * WIDTH
  const y = (value) => BASE - Math.exp((-value * value) / 2) * 130
  const curve = (from, to) => {
    const points = []
    for (let v = from; v <= to + 1e-9; v += 0.1) points.push(`${x(v).toFixed(1)} ${y(v).toFixed(1)}`)
    return points
  }
  const shown = Math.max(-RANGE, Math.min(RANGE, z))
  const flagged = z < THRESHOLD
  return (
    <svg className="bell" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`z of ${z.toFixed(2)} on a normal curve, flag threshold at minus 2.5`}>
      <path
        className="bell-tail"
        d={`M${x(-RANGE)} ${BASE} L${curve(-RANGE, THRESHOLD).join(' L')} L${x(THRESHOLD)} ${BASE}z`}
      />
      <path className="bell-line" d={`M${curve(-RANGE, RANGE).join(' L')}`} />
      <line className="bell-axis" x1="0" y1={BASE} x2={WIDTH} y2={BASE} />
      <line className="bell-limit" x1={x(THRESHOLD)} y1="24" x2={x(THRESHOLD)} y2={BASE} />
      <text className="bell-text" x={x(THRESHOLD)} y="16" textAnchor="middle">−2.5</text>
      <text className="bell-text" x={x(0)} y={BASE + 22} textAnchor="middle">0</text>
      <line className={flagged ? 'bell-z flagged' : 'bell-z'} x1={x(shown)} y1={BASE + 8} x2={x(shown)} y2="60" />
      <circle className={flagged ? 'bell-dot flagged' : 'bell-dot'} cx={x(shown)} cy="60" r="8" />
    </svg>
  )
}

function FlagCalculator() {
  const [n, setN] = useState(3)
  const [bias, setBias] = useState(-1)
  const [sigma, setSigma] = useState(SIGMA)
  const se = sigma / Math.sqrt(n)
  const z = bias / se
  const flagged = z < THRESHOLD
  return (
    <div className="card-dark calc">
      <div className="calc-controls">
        <Slider label="Votes n" value={n} min={1} max={100} onChange={setN} />
        <Slider label="Bias" value={bias} min={-2} max={0.5} step={0.05} onChange={setBias} format={(v) => signed(v)} />
        <Slider label="σ_r" value={sigma} min={0.6} max={0.8} step={0.01} onChange={setSigma} format={(v) => v.toFixed(2)} />
      </div>
      <Bell z={z} />
      <div className="calc-result">
        <span>SE {se.toFixed(3)}</span>
        <span>z {signed(z)}</span>
        <span className={flagged ? 'verdict flagged' : 'verdict'}>{flagged ? 'Flagged' : 'Not flagged'}</span>
      </div>
    </div>
  )
}

export default function NegativeFlag() {
  return (
    <>
      <Opener section="negative-flag" />

      <Slide section="negative-flag" title="Step 1: a residual per vote">
        <p className="body">
          A raw average fails on small n: someone with two 1-star votes looks worse than someone
          with forty. The best way to combat this is <Mark2>residual-based</Mark2>.
        </p>
        <Formula>r = (rater’s score for T) − (T’s average score from everyone else)</Formula>
        <div className="pair">
          <div className="card">
            <p className="tag">Against the room</p>
            <p className="calc-line"><Stars value={1} /> 1 − 2.8 = <strong>−1.8</strong></p>
            <p>The rater gave a 1 and everyone else averages 2.8.</p>
          </div>
          <div className="card">
            <p className="tag">With the room</p>
            <p className="calc-line"><Stars value={1} /> 1 − 1.2 = <strong>−0.2</strong></p>
            <p>The rater gave a 1 and everyone else averages 1.2. They were basically right.</p>
          </div>
        </div>
      </Slide>

      <Slide section="negative-flag" title="Steps 2 and 3: bias and standard error">
        <div className="pair pair-top">
          <div className="stack">
            <p className="tag">Step 2: bias</p>
            <Formula>bias = mean(r₁, r₂, …, rₙ)</Formula>
            <p className="body">
              A fair rater’s bias hovers near 0. A consistently harsh one sits well below.
            </p>
            <p className="body">
              Bias alone doesn’t say how much to trust it. <strong>3 votes</strong> at −1.0 could be
              bad luck, from being assigned three people they truly didn’t rate well.{' '}
              <strong>50 votes</strong> at −1.0 is not luck.
            </p>
          </div>
          <div className="stack">
            <p className="tag">Step 3: standard error</p>
            <Formula>SE = σ_r / √n</Formula>
            <p className="body">How much you’d expect the bias to wobble just from randomness.</p>
            <ul className="defs">
              <li>
                <code>σ_r</code> Standard deviation of residuals across all raters in the system:
                how noisy a single vote typically is. Probably around 0.6–0.8 on a 1–3 scale;
                compute it from your data.
              </li>
              <li>
                <code>n</code> This rater’s number of real votes, excluding “I don’t know them”.
              </li>
            </ul>
            <div className="wobble">
              <div>
                <span>4 votes</span>
                <span className="bar-track light"><span className="bar-fill" style={{ width: '50%' }} /></span>
                <code>σ/2</code>
              </div>
              <div>
                <span>100 votes</span>
                <span className="bar-track light"><span className="bar-fill" style={{ width: '10%' }} /></span>
                <code>σ/10</code>
              </div>
            </div>
            <p className="body">
              <Mark2>The √n is the key part.</Mark2> More votes, smaller SE, and the same bias
              becomes more convincing.
            </p>
          </div>
        </div>
      </Slide>

      <Slide section="negative-flag" title="Step 4: the flag">
        <div className="split">
          <div className="stack">
            <Formula>z = bias / SE</Formula>
            <p className="body">How many standard errors below zero is this rater’s bias?</p>
            <p className="body big">
              <Mark2>Flag when z &lt; −2.5</Mark2>
            </p>
            <p className="body">
              At z = −2.5, there’s roughly a 0.6% chance a fair rater would look this harsh by
              accident: a strong signal without being absurdly strict.
            </p>
          </div>
          <FlagCalculator />
        </div>
      </Slide>

      <Slide section="negative-flag" title="Example: one rater, start to finish">
        <div className="split split-even">
          <table className="ledger">
            <thead>
              <tr>
                <th>Vote</th>
                <th>Gave</th>
                <th>Others avg</th>
                <th>Residual</th>
              </tr>
            </thead>
            <tbody>
              {VOTES.map((vote) => (
                <tr key={vote.target}>
                  <td>{vote.target}</td>
                  <td><Stars value={vote.score} /></td>
                  <td>{vote.others.toFixed(1)}</td>
                  <td className="num">{signed(vote.residual, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="stack">
            <ol className="steps">
              <li>
                <span>Bias</span>
                <code>−4.9 / {VOTES.length} = {signed(WORKED_BIAS)}</code>
              </li>
              <li>
                <span>SE, with σ_r = {SIGMA}</span>
                <code>{SIGMA} / √{VOTES.length} = {WORKED_SE.toFixed(2)}</code>
              </li>
              <li>
                <span>z</span>
                <code>{signed(WORKED_BIAS)} / {WORKED_SE.toFixed(2)} = {signed(WORKED_Z)}</code>
              </li>
            </ol>
            <p className="body">
              {signed(WORKED_Z)} is below −2.5, so <Mark2>this rater is flagged</Mark2>, even though
              one of their five harsh votes was basically right.
            </p>
            <table className="compare">
              <caption>Same test, other raters</caption>
              <tbody>
                {COMPARE.map(({ name, n, bias }) => {
                  const z = zScore(bias, n)
                  return (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>n {n}</td>
                      <td>bias {signed(bias)}</td>
                      <td>z {signed(z)}</td>
                      <td className={z < THRESHOLD ? 'flag-yes' : 'flag-no'}>{z < THRESHOLD ? 'Flag' : 'No flag'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Slide>
    </>
  )
}
