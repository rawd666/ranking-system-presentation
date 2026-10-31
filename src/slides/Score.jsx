import { useState } from 'react'
import { Formula, Mark2, Opener, Slide, Slider, Star, Stars } from '../components/ui.jsx'

const CRITERIA = ['Attitude', 'Evaluation', 'Helpfulness']
const REVEAL_AT = 10

function StarPicker({ label, value, onChange }) {
  return (
    <div className="picker">
      <span>{label}</span>
      <span className="picker-stars" role="group" aria-label={label}>
        {[1, 2, 3].map((stars) => (
          <button
            key={stars}
            type="button"
            aria-label={`${stars} of 3 stars`}
            aria-pressed={value === stars}
            onClick={() => onChange(stars)}
          >
            <Star fill={stars <= value ? 1 : 0} />
          </button>
        ))}
      </span>
    </div>
  )
}

function ScoreDemo() {
  const [ratings, setRatings] = useState([1, 1, 1])
  const [votes, setVotes] = useState(1)
  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
  const revealed = votes >= REVEAL_AT
  return (
    <div className="card-dark calc">
      <p className="tag tag-accent">Try it: mean rating per criterion</p>
      {CRITERIA.map((criterion, i) => (
        <StarPicker
          key={criterion}
          label={criterion}
          value={ratings[i]}
          onChange={(value) => setRatings((now) => now.map((r, j) => (j === i ? value : r)))}
        />
      ))}
      <Slider label="People who have voted" value={votes} min={1} max={20} onChange={setVotes} />
      <div className="score-out" aria-live="polite">
        {revealed ? (
          <>
            <span className="score-num">{average.toFixed(2)}<small> / 3</small></span>
            <Stars value={average} label={`${average.toFixed(2)} of 3 stars`} />
          </>
        ) : (
          <>
            <span className="score-hidden">Score hidden</span>
            <span className="meter">
              <span className="meter-fill" style={{ width: `${(votes / REVEAL_AT) * 100}%` }} />
            </span>
            <span className="meter-text">{votes} of {REVEAL_AT} votes</span>
          </>
        )}
      </div>
    </div>
  )
}

export default function Score() {
  return (
    <>
      <Opener section="score" />

      <Slide section="score" title="Three criteria, one score">
        <div className="split">
          <div className="stack">
            <p className="body">
              Three criteria are included to rate a student on. The final rating is an average of
              all 3.
            </p>
            <ul className="criteria">
              {CRITERIA.map((criterion) => <li key={criterion}>{criterion}</li>)}
            </ul>
            <Formula>score = (attitude + evaluation + helpfulness) / 3</Formula>
            <p className="body">
              For the displayed score, <Mark2>do not display the full average until 10 people have
              voted</Mark2>, so a student with one 1-star vote doesn’t show a 1.0.
            </p>
          </div>
          <ScoreDemo />
        </div>
      </Slide>
    </>
  )
}
