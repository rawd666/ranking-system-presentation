import { useState } from 'react'
import { Formula, Mark2, Opener, Slide, Slider } from '../components/ui.jsx'

const D_REF = 7
const LOG_ROWS = [50, 100, 200, 400, 1000]
const LOG_MAX = Math.log2(1000)

const freeVotes = (a, N, D) => Math.ceil((a * Math.log2(N) * D) / D_REF)

function CapCalculator() {
  const [N, setN] = useState(200)
  const [D, setD] = useState(7)
  const [a, setA] = useState(1)
  const [assignments, setAssignments] = useState(4)
  const M = Math.min(4, assignments)
  const F = freeVotes(a, N, D)
  return (
    <div className="card-dark calc">
      <div className="calc-controls two">
        <Slider label="Students N" value={N} min={20} max={1000} step={10} onChange={setN} />
        <Slider label="Days D" value={D} min={1} max={21} onChange={setD} />
        <Slider label="Tuning a" value={a} min={0.5} max={2} step={0.25} onChange={setA} format={(v) => v.toFixed(2)} />
        <Slider label="Mandatory assignments" value={assignments} min={0} max={6} onChange={setAssignments} />
      </div>
      <div className="cap-result">
        <span className="cap-total">{M + F}</span>
        <span className="cap-sum">
          votes = {M} mandatory + {F} free
        </span>
      </div>
      <div className="blocks" aria-hidden="true">
        {Array.from({ length: M }, (_, i) => <i key={`m${i}`} className="block block-m" />)}
        {Array.from({ length: F }, (_, i) => <i key={`f${i}`} className="block block-f" />)}
      </div>
    </div>
  )
}

export default function VoteCap() {
  return (
    <>
      <Opener section="vote-cap" />

      <Slide section="vote-cap" title="C(N, D): how many votes a student can make">
        <div className="split">
          <div className="stack">
            <p className="body">
              <Mark2>Total votes given equals total votes received.</Mark2> If each student should
              receive at least R ratings per round, the cap must be at least R, and in practice
              higher, because free votes concentrate on popular people.
            </p>
            <p className="body">The mandatory votes are what guarantee the floor.</p>
            <Formula>
              C(N, D) = M + F
              <br />
              M = min(4, mandatory assignments)
              <br />
              F = ceil(a · log2(N) · D / D_ref)
            </Formula>
          </div>
          <dl className="terms">
            <div>
              <dt>C(N, D)</dt>
              <dd>
                The cap. N is the number of students participating, D the number of days the voting
                window is open. “I don’t know them” responses don’t count against it.
              </dd>
            </div>
            <div>
              <dt>M</dt>
              <dd>
                Mandatory votes, the random assignments. Max 4, unless fewer people need filling
                in. Each student must complete these before unlocking their free votes.
              </dd>
            </div>
            <div>
              <dt>F</dt>
              <dd>Free votes. This is the part with actual logic in it.</dd>
            </div>
          </dl>
        </div>
      </Slide>

      <Slide section="vote-cap" title="F, factor one: log2(N) for cohort size">
        <div className="split">
          <div className="stack">
            <p className="body">
              Doubling the number of students shouldn’t double how many people you can meaningfully
              rate. You don’t know twice as many people in a cohort of 400 as in one of 200.
            </p>
            <p className="body">
              <Mark2>log2 grows slowly.</Mark2> Going from 100 students to 1000 only adds about 3–4
              free votes, which matches the intuition.
            </p>
          </div>
          <div className="card-dark">
            <p className="tag tag-accent">N and log2(N)</p>
            <ul className="bars">
              {LOG_ROWS.map((N) => (
                <li key={N}>
                  <span className="bar-label">{N}</span>
                  <span className="bar-track">
                    <span className="bar-fill" style={{ width: `${(Math.log2(N) / LOG_MAX) * 100}%` }} />
                  </span>
                  <span className="bar-value">{Math.log2(N).toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Slide>

      <Slide section="vote-cap" title="F, factors two and three: D / D_ref and a">
        <div className="split">
          <div className="stack">
            <p className="tag">D / D_ref: window length</p>
            <p className="body">
              D_ref is a reference length you pick, here 7 days. A 7-day window gives a factor of 1,
              which does nothing. 14 days gives 2 and doubles the free votes. 3 days gives ~0.43 and
              cuts them. A long window gives people room to rate more without re-tuning anything.
            </p>
            <p className="tag">a: tuning knob</p>
            <p className="body">
              Start at 1. Raise it if students complain they can’t rate enough people; lower it if
              you want vote counts tighter. It just scales the whole thing.
            </p>
            <p className="tag">ceil</p>
            <p className="body">Rounds up so you get a whole number.</p>
          </div>
          <CapCalculator />
        </div>
      </Slide>
    </>
  )
}
