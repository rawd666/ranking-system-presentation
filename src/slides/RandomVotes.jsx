import { Formula, Mark2, Opener, Slide } from '../components/ui.jsx'

const STUDENTS = [
  { name: 'Student A', received: 2 },
  { name: 'Student B', received: 4 },
  { name: 'Student C', received: 8 },
  { name: 'Student D', received: 16 },
]
const WEIGHT_TOTAL = STUDENTS.reduce((sum, s) => sum + 1 / s.received, 0)

function AssignmentChart() {
  return (
    <div className="card-dark">
      <p className="tag tag-accent">Chance of being assigned next</p>
      <ul className="bars">
        {STUDENTS.map(({ name, received }) => {
          const share = 1 / received / WEIGHT_TOTAL
          return (
            <li key={name}>
              <span className="bar-label">
                {name}
                <small>{received} ratings so far</small>
              </span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${share * 100}%` }} />
              </span>
              <span className="bar-value">{Math.round(share * 100)}%</span>
            </li>
          )
        })}
      </ul>
      <p className="fine">Example figures.</p>
    </div>
  )
}

const FREE_MEAN = 1.3
const RANDOM_MEAN = 2.6
const toPct = (mean) => ((mean - 1) / 2) * 100

function GapChart() {
  return (
    <div className="card-dark">
      <p className="tag tag-accent">One target, two kinds of vote</p>
      <div className="gap">
        <div className="gap-axis">
          <span>1</span>
          <span>2</span>
          <span>3</span>
        </div>
        {[
          ['Free votes', FREE_MEAN, 'gap-free'],
          ['Random votes', RANDOM_MEAN, 'gap-random'],
        ].map(([label, mean, kind]) => (
          <div className="gap-row" key={label}>
            <span className="gap-label">{label}</span>
            <span className="gap-track">
              <span className={`gap-dot ${kind}`} style={{ left: `${toPct(mean)}%` }}>
                {mean.toFixed(1)}
              </span>
            </span>
          </div>
        ))}
      </div>
      <p className="gap-result">
        Gap <strong>−{(RANDOM_MEAN - FREE_MEAN).toFixed(1)}</strong>
      </p>
      <p className="fine">Example figures.</p>
    </div>
  )
}

export default function RandomVotes() {
  return (
    <>
      <Opener section="random-votes" />

      <Slide section="random-votes" title="Assign by what the network needs">
        <div className="split">
          <div className="stack">
            <p className="body">
              The assignment shouldn’t be uniformly random. Sample targets with probability{' '}
              <Mark2>inversely proportional to ratings received so far</Mark2>, so the people with
              the thinnest data get filled in first.
            </p>
            <Formula>P(target) ∝ 1 / ratings received</Formula>
            <p className="body">That’s what “based on the network’s needs” should mean in code.</p>
            <div className="note">
              <p className="tag">“I don’t know them”</p>
              <p>
                Cap how many of these responses a voter can give before they get reassigned, and
                don’t count them toward the vote cap.
              </p>
            </div>
          </div>
          <AssignmentChart />
        </div>
      </Slide>

      <Slide section="random-votes" title="The payoff: votes that can’t be weaponized">
        <div className="split">
          <div className="stack">
            <p className="body">
              Random-assignment votes can’t be weaponized, because the attacker didn’t choose the
              target. So <Mark2>treat them as the ground truth</Mark2>.
            </p>
            <p className="body">
              For each target, compare the mean of their free votes against the mean of their random
              votes.
            </p>
            <div className="note note-strong">
              <p className="tag">Coordinated-attack flag</p>
              <ol className="checks">
                <li>A big negative gap</li>
                <li>The free raters form a tight positive cluster in the signed graph</li>
              </ol>
            </div>
          </div>
          <GapChart />
        </div>
      </Slide>
    </>
  )
}
