import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import ShareType from '../components/ShareType'
import {
  SCALE,
  AXES,
  PRODUCT_SKILLS,
  PRESENTATION_ORDER,
  ITEM_INDEX,
  TOTAL_ITEMS,
  LEVELS,
  scoreResponses,
  assignArchetype,
  strongestAxes,
  levelBand,
  metacognitionRead,
} from '../data/tpmSelfCheckData'
import './TpmSelfCheck.css'

const STORAGE_KEY = 'uc-tpm-self-check-v3'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

// Join a list with commas and a closing "and" (Oxford comma for three or more).
function listWithAnd(items) {
  if (items.length <= 1) return items.join('')
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

const axisById = (id) => AXES.find((a) => a.id === id)
const axisName = (id) => axisById(id)?.name ?? id

// Radar geometry for the six durable skills. Angle starts at top, goes clockwise.
function radarPoints(axisLevels, radius, cx, cy) {
  const n = AXES.length
  return AXES.map((axis, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
    const level = axisLevels[axis.id]
    const r = level == null ? 0 : (level / 5) * radius
    return {
      id: axis.id,
      short: axis.short,
      axisX: cx + radius * Math.cos(angle),
      axisY: cy + radius * Math.sin(angle),
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      angle,
    }
  })
}

// Hexagon ring polygons at fractions of the radius, so the grid matches the shape.
function ringPolygon(fraction, radius, cx, cy) {
  const n = AXES.length
  return AXES.map((_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
    return `${cx + fraction * radius * Math.cos(angle)},${cy + fraction * radius * Math.sin(angle)}`
  }).join(' ')
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

  // Archetype and strengths (only meaningful when complete).
  let match = null
  let topAxes = []
  if (complete) {
    match = assignArchetype(score.profile)
    topAxes = strongestAxes(score.axes)
  }

  // Radar SVG dimensions.
  const SIZE = 300
  const CX = SIZE / 2
  const CY = SIZE / 2
  const R = 96
  const points = radarPoints(complete ? score.axes : {}, R, CX, CY)
  const polygon = points.map((p) => `${p.x},${p.y}`).join(' ')
  const rings = [0.25, 0.5, 0.75, 1]

  return (
    <div className="tsc-page">
      <PageMeta
        title="TPM self-check"
        description="An unvalidated self-reflection for technical product managers. It maps your six durable skills and names the archetype your shape is closest to. For your own development. Your answers stay on your device."
      />

      <section className="tsc-intro" aria-labelledby="tsc-heading">
        <h1 id="tsc-heading">TPM self-check</h1>

        <div className="tsc-callout" role="note">
          <p className="tsc-callout-title">Start here</p>
          <ul>
            <li><strong>Six durable skills, one shape.</strong> You answer for the six, and the shape of your hexagon names the archetype you are closest to.</li>
            <li><strong>It leads with your strengths.</strong> It is not pass/fail, and it never compares you to anyone else. A working draft, grounded in research and not yet validated.</li>
            <li><strong>Your answers stay on your device.</strong> Nothing is sent anywhere.</li>
          </ul>
        </div>

        <p className="tsc-browse-types">
          Want to see the shapes first? <Link to="/tpm-types">Browse all the types</Link>.
        </p>

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
          {complete ? 'See your shape' : `Answer all ${TOTAL_ITEMS} to see your shape`}
        </button>
        <button className="btn btn-secondary" onClick={() => window.print()}>Print</button>
        <button className="btn btn-secondary" onClick={handleReset} disabled={answeredCount === 0}>Clear</button>
      </div>

      <section className="tsc-result" aria-labelledby="tsc-result-heading" ref={resultRef} tabIndex={-1}>
        <h2 id="tsc-result-heading">Your shape</h2>

        {!complete && (
          <p className="tsc-result-note">
            Answer all {TOTAL_ITEMS} statements and your hexagon appears here: your six durable
            skills, the archetype your shape is closest to, and who complements you.
          </p>
        )}

        {complete && (
          <>
            <div className="tsc-archetype">
              <p className="tsc-archetype-label">
                You are closest to
                {match.leaning && match.secondary ? (
                  <span className="tsc-archetype-lean">
                    , leaning{' '}
                    <Link to={`/tpm-types/${match.secondary.id}`}>{match.secondary.name}</Link>
                  </span>
                ) : null}
              </p>
              <p className="tsc-archetype-name">
                <Link to={`/tpm-types/${match.primary.id}`}>{match.primary.name}</Link>
                {match.primary.rare && <span className="tsc-rare-tag">Rare</span>}
              </p>
              <p className="tsc-archetype-role">{match.primary.role}</p>
              <p className="tsc-archetype-read">{match.primary.read}</p>
              <p className="tsc-archetype-pair">
                <span className="tsc-archetype-pair-label">Team up with</span>{' '}
                <strong>{match.primary.complement}</strong>, who covers the skills you lean on least.
              </p>
            </div>

            <figure className="tsc-radar-figure">
              <svg
                className="tsc-radar"
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                role="img"
                aria-label={`Your durable-skills hexagon. Strongest: ${axisName(topAxes[0])} and ${axisName(topAxes[1])}.`}
              >
                {rings.map((ring) => (
                  <polygon key={ring} points={ringPolygon(ring, R, CX, CY)} className="tsc-radar-ring" />
                ))}
                {points.map((p) => (
                  <line key={p.id} x1={CX} y1={CY} x2={p.axisX} y2={p.axisY} className="tsc-radar-axis" />
                ))}
                <polygon points={polygon} className="tsc-radar-area" />
                {points.map((p) => (
                  <circle key={p.id} cx={p.x} cy={p.y} r={4} className="tsc-radar-dot" />
                ))}
                {points.map((p) => {
                  const outX = CX + (R + 16) * Math.cos(p.angle)
                  const outY = CY + (R + 16) * Math.sin(p.angle)
                  const anchor = Math.abs(outX - CX) < 12 ? 'middle' : outX > CX ? 'start' : 'end'
                  return (
                    <text key={p.id} x={outX} y={outY} textAnchor={anchor} className="tsc-radar-label" dominantBaseline="middle">
                      {p.short}
                    </text>
                  )
                })}
              </svg>
            </figure>

            <p className="tsc-result-frame">
              Your shape names the archetype, not your job title. The two skills you scored
              highest, <strong>{axisName(topAxes[0])}</strong> and <strong>{axisName(topAxes[1])}</strong>,
              are what put you there. Treat it as a starting point, and check it against your real work.
            </p>

            <ShareType type={match.primary} profile={score.profile} lead headingLevel={3} />

            <div className="tsc-meta-read">
              <h3>How consistently it shows up</h3>
              <p>{metacognitionRead(score.metaMean)}</p>
            </div>

            {/* Text equivalent of the radar, for screen readers and print. */}
            <p className="tsc-scale-legend">
              Level runs low to high: {LEVELS.map((l) => l.label).join(', ')}.
            </p>
            <table className="tsc-table">
              <caption>Your six durable skills, strongest first</caption>
              <thead>
                <tr><th scope="col">Durable skill</th><th scope="col">Level</th></tr>
              </thead>
              <tbody>
                {AXES
                  .map((a) => ({ id: a.id, name: a.name, def: a.blurb, level: score.axes[a.id] }))
                  .sort((a, b) => b.level - a.level)
                  .map((a) => {
                    const band = levelBand(a.level)
                    return (
                      <tr key={a.id}>
                        <th scope="row">
                          {a.name}
                          <span className="tsc-craft-def">{a.def}</span>
                        </th>
                        <td>
                          <span className="tsc-level">
                            <span className="tsc-level-dots" aria-hidden="true">
                              {LEVELS.map((lvl, i) => (
                                <span key={lvl.id} className={`tsc-level-dot ${i <= band.index ? 'is-on' : ''}`} />
                              ))}
                            </span>
                            <span className="tsc-level-label">
                              {band.label}
                              <span className="sr-only"> ({band.index + 1} of {LEVELS.length})</span>
                            </span>
                          </span>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>

            <div className="tsc-product">
              <h3>What the six set you up for</h3>
              <p className="tsc-product-frame">
                The product skills below are not asked directly. They are what your durable
                skills add up to, amplified by how consistently they show up.
              </p>
              <table className="tsc-table">
                <caption>Product skills, built on the durable foundation</caption>
                <thead>
                  <tr><th scope="col">Product skill</th><th scope="col">Level</th></tr>
                </thead>
                <tbody>
                  {PRODUCT_SKILLS
                    .map((s) => ({ ...s, level: score.product[s.id] }))
                    .sort((a, b) => b.level - a.level)
                    .map((s) => {
                      const band = levelBand(s.level)
                      return (
                        <tr key={s.id}>
                          <th scope="row">
                            {s.name}
                            <span className="tsc-craft-def">
                              {s.def} Built on {listWithAnd(s.fedBy.map((id) => axisName(id).toLowerCase()))}.
                            </span>
                          </th>
                          <td>
                            <span className="tsc-level">
                              <span className="tsc-level-dots" aria-hidden="true">
                                {LEVELS.map((lvl, i) => (
                                  <span key={lvl.id} className={`tsc-level-dot ${i <= band.index ? 'is-on' : ''}`} />
                                ))}
                              </span>
                              <span className="tsc-level-label">
                                {band.label}
                                <span className="sr-only"> ({band.index + 1} of {LEVELS.length})</span>
                              </span>
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>

            <div className="tsc-next" aria-labelledby="tsc-next-heading">
              <h3 id="tsc-next-heading">Want the real picture?</h3>
              <p>
                This is a self-report snapshot. The full assessment adds a 360 from the people
                you work with, a look at your actual delivery artifacts, and time watching the
                work in flight, for you or your whole team, where the archetypes become a
                team-composition read: who pairs with whom, and where the group is thin.
              </p>
              <Link to="/office-hours" className="btn btn-primary">Talk it through at office hours</Link>
              <p className="tsc-next-alt">
                Or <Link to="/questions">ask us a question for free</Link>.
              </p>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default TpmSelfCheck
