import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import {
  SCALE,
  COMPETENCIES,
  CRAFT_SKILLS,
  GROWTH_ACTIONS,
  PRESENTATION_ORDER,
  ITEM_INDEX,
  TOTAL_ITEMS,
  scoreResponses,
  levelBand,
  metacognitionRead,
} from '../data/tpmSelfCheckData'
import './TpmSelfCheck.css'

const STORAGE_KEY = 'uc-tpm-self-check-v2'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const compName = (id) => COMPETENCIES.find((c) => c.id === id)?.name ?? id
const craftName = (id) => CRAFT_SKILLS.find((c) => c.id === id)?.name ?? id
// How many craft skills each competency feeds (its leverage).
const feedCount = (compId) => CRAFT_SKILLS.filter((s) => s.fedBy.includes(compId)).length

// Radar geometry for the five craft skills.
function radarPoints(levels, radius, cx, cy) {
  const n = CRAFT_SKILLS.length
  return CRAFT_SKILLS.map((skill, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
    const level = levels[skill.id]
    const r = level == null ? 0 : (level / 5) * radius
    return {
      id: skill.id,
      name: skill.name,
      short: skill.short,
      axisX: cx + radius * Math.cos(angle),
      axisY: cy + radius * Math.sin(angle),
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      angle,
    }
  })
}

function TpmSelfCheck() {
  const [responses, setResponses] = useState(loadSaved)
  const resultRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(responses))
    } catch {
      // No persistence in a private window or when storage is blocked; the page still works.
    }
  }, [responses])

  const answeredCount = PRESENTATION_ORDER.filter((id) => responses[id] != null).length
  const complete = answeredCount === TOTAL_ITEMS
  const progress = (answeredCount / TOTAL_ITEMS) * 100

  function setAnswer(itemId, value) {
    setResponses((prev) => ({ ...prev, [itemId]: value }))
  }

  function handleReset() {
    setResponses({})
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    window.scrollTo(0, 0)
  }

  function handleSeeResults() {
    resultRef.current?.scrollIntoView({ behavior: 'smooth' })
    resultRef.current?.focus()
  }

  const score = scoreResponses(responses)

  // Strongest and growth craft (only meaningful when complete).
  let strongest = null
  let growth = null
  let focus = null
  if (complete) {
    const craftEntries = CRAFT_SKILLS.map((s) => ({ id: s.id, level: score.craft[s.id] }))
    strongest = craftEntries.reduce((a, b) => (b.level > a.level ? b : a))
    growth = craftEntries.reduce((a, b) => (b.level < a.level ? b : a))
    // Highest-leverage competency to focus: low score, feeds many skills.
    focus = COMPETENCIES.map((c) => ({
      id: c.id,
      deficit: (5 - score.competencies[c.id]) * feedCount(c.id),
    })).reduce((a, b) => (b.deficit > a.deficit ? b : a))
  }

  // Radar SVG dimensions.
  const SIZE = 320
  const CX = SIZE / 2
  const CY = SIZE / 2
  const R = 100
  const points = radarPoints(complete ? score.craft : {}, R, CX, CY)
  const polygon = points.map((p) => `${p.x},${p.y}`).join(' ')
  const rings = [0.25, 0.5, 0.75, 1]

  return (
    <div className="tsc-page">
      <PageMeta
        title="TPM self-check"
        description="A private, unvalidated self-reflection for technical product managers. See where you are strong and where to grow. For development, not judgment. Your answers stay on your device."
        noindex
      />

      <section className="tsc-intro" aria-labelledby="tsc-heading">
        <p className="tsc-eyebrow">Internal draft, not on the public site yet</p>
        <h1 id="tsc-heading">TPM self-check</h1>
        <p className="tsc-lead">
          Nineteen quick statements. At the end you get a picture of where your delivery
          strengths are and the one place to focus next.
        </p>

        <div className="tsc-callout" role="note">
          <p className="tsc-callout-title">Start here</p>
          <ul>
            <li><strong>This is a mirror, not a test.</strong> A working draft, grounded in research but not yet validated.</li>
            <li><strong>It is for growth, not judgment.</strong> Nothing here ranks or grades you.</li>
            <li><strong>Your answers stay on your device.</strong> Nothing is sent anywhere.</li>
          </ul>
        </div>

        <div className="tsc-scale-key" aria-hidden="true">
          <span>1 = strongly disagree</span>
          <span>5 = strongly agree</span>
        </div>
      </section>

      <div
        className="tsc-progress"
        role="progressbar"
        aria-valuenow={answeredCount}
        aria-valuemin={0}
        aria-valuemax={TOTAL_ITEMS}
        aria-label={`${answeredCount} of ${TOTAL_ITEMS} answered`}
      >
        <div className="tsc-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="tsc-progress-text">{answeredCount} of {TOTAL_ITEMS} answered</p>

      <ol className="tsc-items">
        {PRESENTATION_ORDER.map((id, index) => {
          const item = ITEM_INDEX[id]
          return (
            <li key={id}>
              <fieldset className="tsc-item">
                <legend className="tsc-item-text">
                  <span className="tsc-item-num" aria-hidden="true">{index + 1}.</span> {item.text}
                </legend>
                <div className="tsc-scale" role="radiogroup" aria-label={item.text}>
                  {SCALE.map((point) => {
                    const checked = responses[id] === point.value
                    return (
                      <label
                        key={point.value}
                        className={`tsc-scale-option ${checked ? 'is-checked' : ''}`}
                        title={point.label}
                      >
                        <input
                          type="radio"
                          name={id}
                          value={point.value}
                          checked={checked}
                          onChange={() => setAnswer(id, point.value)}
                          className="sr-only"
                        />
                        <span className="tsc-scale-num" aria-hidden="true">{point.value}</span>
                        <span className="sr-only">{point.value}, {point.label}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            </li>
          )
        })}
      </ol>

      <div className="tsc-actions">
        <button className="btn btn-primary btn-large" onClick={handleSeeResults} disabled={!complete}>
          {complete ? 'See your map' : `Answer all ${TOTAL_ITEMS} to see your map`}
        </button>
        <button className="btn btn-secondary" onClick={() => window.print()}>Print</button>
        <button className="btn btn-secondary" onClick={handleReset} disabled={answeredCount === 0}>Clear</button>
      </div>

      <section className="tsc-result" aria-labelledby="tsc-result-heading" ref={resultRef} tabIndex={-1}>
        <h2 id="tsc-result-heading">Your map</h2>

        {!complete && (
          <p className="tsc-result-note">
            Answer all {TOTAL_ITEMS} statements and your map appears here: your five delivery
            strengths, and where to focus next.
          </p>
        )}

        {complete && (
          <>
            <p className="tsc-result-frame">
              A shape, not a score. It shows how your teamwork habits and self-awareness show
              up across the five delivery skills. Check it against your real work.
            </p>

            <figure className="tsc-radar-figure">
              <svg
                className="tsc-radar"
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                role="img"
                aria-label={`Delivery strengths. Strongest: ${craftName(strongest.id)}. Most room to grow: ${craftName(growth.id)}.`}
              >
                {rings.map((ring) => (
                  <circle key={ring} cx={CX} cy={CY} r={R * ring} className="tsc-radar-ring" />
                ))}
                {points.map((p) => (
                  <line key={p.id} x1={CX} y1={CY} x2={p.axisX} y2={p.axisY} className="tsc-radar-axis" />
                ))}
                <polygon points={polygon} className="tsc-radar-area" />
                {points.map((p) => (
                  <circle key={p.id} cx={p.x} cy={p.y} r={4} className="tsc-radar-dot" />
                ))}
                {points.map((p) => {
                  const outX = CX + (R + 6) * Math.cos(p.angle)
                  const outY = CY + (R + 6) * Math.sin(p.angle)
                  const anchor = Math.abs(outX - CX) < 12 ? 'middle' : outX > CX ? 'start' : 'end'
                  return (
                    <text key={p.id} x={outX} y={outY} textAnchor={anchor} className="tsc-radar-label" dominantBaseline="middle">
                      {p.short}
                    </text>
                  )
                })}
              </svg>
            </figure>

            <div className="tsc-reads">
              <div className="tsc-read tsc-read--strong">
                <p className="tsc-read-label">Strongest</p>
                <p className="tsc-read-value">{craftName(strongest.id)}</p>
              </div>
              <div className="tsc-read tsc-read--grow">
                <p className="tsc-read-label">Most room to grow</p>
                <p className="tsc-read-value">{craftName(growth.id)}</p>
              </div>
            </div>

            <div className="tsc-focus">
              <h3>Where to focus first</h3>
              <p>
                <strong>{compName(focus.id)}.</strong> It feeds{' '}
                {CRAFT_SKILLS.filter((s) => s.fedBy.includes(focus.id)).map((s) => s.name.toLowerCase()).join(', ')}
                , so growing it strengthens more than one skill at once.
              </p>
              <p className="tsc-focus-action">{GROWTH_ACTIONS[focus.id]}</p>
            </div>

            <div className="tsc-meta-read">
              <h3>How consistently it shows up</h3>
              <p>{metacognitionRead(score.metaMean)}</p>
            </div>

            {/* Text equivalent of the radar, for screen readers and print. */}
            <table className="tsc-table">
              <caption>Your delivery skills, strongest to most room to grow</caption>
              <thead>
                <tr><th scope="col">Delivery skill</th><th scope="col">Strength</th></tr>
              </thead>
              <tbody>
                {CRAFT_SKILLS
                  .map((s) => ({ id: s.id, name: s.name, level: score.craft[s.id] }))
                  .sort((a, b) => b.level - a.level)
                  .map((s) => (
                    <tr key={s.id}>
                      <th scope="row">{s.name}</th>
                      <td>{levelBand(s.level).label}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="tsc-next" aria-labelledby="tsc-next-heading">
              <h3 id="tsc-next-heading">Want the real picture?</h3>
              <p>
                This is a self-report snapshot. The full assessment adds a 360 from the people
                you work with, a look at your actual delivery artifacts, and time watching the
                work in flight, for you or your whole team.
              </p>
              <Link to="/office-hours" className="btn btn-primary">Talk it through at office hours</Link>
              <p className="tsc-next-alt">
                Or <Link to="/questions">ask us a question for free</Link>.
              </p>
            </div>

            <div className="tsc-debrief">
              <h3>For the pilot debrief</h3>
              <p>
                Which statements were unclear, felt off, or did not fit the work you actually
                do? Those are the items to fix. Print this and bring your notes.
              </p>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default TpmSelfCheck
