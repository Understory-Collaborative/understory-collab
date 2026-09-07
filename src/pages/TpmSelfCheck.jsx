import { useState, useEffect, useRef } from 'react'
import PageMeta from '../components/PageMeta'
import { LAYERS, SCALE, ALL_ITEM_IDS, TOTAL_ITEMS, readBand } from '../data/tpmSelfCheckData'
import './TpmSelfCheck.css'

const STORAGE_KEY = 'uc-tpm-self-check-v1'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function average(values) {
  if (!values.length) return null
  return values.reduce((a, b) => a + b, 0) / values.length
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
      // A private window or blocked storage just means no persistence. The page
      // still works for this session.
    }
  }, [responses])

  const answeredCount = ALL_ITEM_IDS.filter((id) => responses[id] != null).length
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

  function handleSeeProfile() {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' })
      resultRef.current.focus()
    }
  }

  // Per-layer averages from whatever is answered so far.
  const layerAverages = LAYERS.map((layer) => {
    const ids = layer.constructs.flatMap((c) => c.items.map((i) => i.id))
    const vals = ids.map((id) => responses[id]).filter((v) => v != null)
    return { id: layer.id, name: layer.name, avg: average(vals), answered: vals.length, total: ids.length }
  })

  return (
    <div className="tsc-page">
      <PageMeta
        title="TPM self-check"
        description="A private, unvalidated self-reflection on technical-product-management capability. For development, not selection. Your answers stay on your device."
        noindex
      />

      <section className="tsc-intro" aria-labelledby="tsc-heading">
        <p className="tsc-eyebrow">Internal draft, not for the public site yet</p>
        <h1 id="tsc-heading">TPM self-check</h1>
        <p className="tsc-lead">
          A quiet mirror for how you lead delivery work, across three layers: the thinking
          underneath, how you work with people, and the visible craft.
        </p>

        <div className="tsc-callout" role="note">
          <p className="tsc-callout-title">Read this first</p>
          <ul>
            <li>
              <strong>This is not a validated test.</strong> It is a working draft, grounded
              in research but not yet checked for reliability or validity.
            </li>
            <li>
              <strong>It is for development, not judgment.</strong> Use it to reflect and to
              decide where to grow, never to rank, hire, or grade anyone.
            </li>
            <li>
              <strong>Your answers stay on your device.</strong> Nothing is sent anywhere.
              You can clear them at any time.
            </li>
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
        aria-label={`${answeredCount} of ${TOTAL_ITEMS} statements answered`}
      >
        <div className="tsc-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="tsc-progress-text">{answeredCount} of {TOTAL_ITEMS} answered</p>

      {LAYERS.map((layer) => (
        <section key={layer.id} className="tsc-layer" aria-labelledby={`layer-${layer.id}`}>
          <h2 id={`layer-${layer.id}`} className="tsc-layer-name">{layer.name}</h2>
          <p className="tsc-layer-blurb">{layer.blurb}</p>

          {layer.constructs.map((construct) => (
            <div key={construct.id} className="tsc-construct">
              <h3 className="tsc-construct-name">{construct.name}</h3>
              {construct.items.map((item) => (
                <fieldset key={item.id} className="tsc-item">
                  <legend className="tsc-item-text">{item.text}</legend>
                  <div className="tsc-scale" role="radiogroup" aria-label={item.text}>
                    {SCALE.map((point) => {
                      const checked = responses[item.id] === point.value
                      return (
                        <label
                          key={point.value}
                          className={`tsc-scale-option ${checked ? 'is-checked' : ''}`}
                          title={point.label}
                        >
                          <input
                            type="radio"
                            name={item.id}
                            value={point.value}
                            checked={checked}
                            onChange={() => setAnswer(item.id, point.value)}
                            className="sr-only"
                          />
                          <span className="tsc-scale-num" aria-hidden="true">{point.value}</span>
                          <span className="sr-only">{point.value}, {point.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          ))}
        </section>
      ))}

      <div className="tsc-actions">
        <button className="btn btn-primary btn-large" onClick={handleSeeProfile} disabled={answeredCount === 0}>
          See your profile
        </button>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          Print
        </button>
        <button className="btn btn-secondary" onClick={handleReset} disabled={answeredCount === 0}>
          Clear answers
        </button>
      </div>

      <section className="tsc-result" aria-labelledby="tsc-result-heading" ref={resultRef} tabIndex={-1}>
        <h2 id="tsc-result-heading">Your profile</h2>
        {!complete && (
          <p className="tsc-result-note">
            {answeredCount === 0
              ? 'Answer the statements above and your profile builds here.'
              : `A partial read from the ${answeredCount} you have answered so far. Finish all ${TOTAL_ITEMS} for the full picture.`}
          </p>
        )}
        <p className="tsc-result-frame">
          These are averages of your own ratings, not scores. Treat each as a prompt for a
          conversation, and check it against a real artifact or a colleague who has seen your
          work.
        </p>

        <div className="tsc-profile">
          {layerAverages.map((layer) => (
            <div key={layer.id} className="tsc-profile-row">
              <div className="tsc-profile-head">
                <span className="tsc-profile-name">{layer.name}</span>
                <span className="tsc-profile-score">
                  {layer.avg == null ? 'not yet' : `${layer.avg.toFixed(1)} / 5`}
                </span>
              </div>
              <div className="tsc-meter" aria-hidden="true">
                <div
                  className="tsc-meter-fill"
                  style={{ width: layer.avg == null ? '0%' : `${(layer.avg / 5) * 100}%` }}
                />
              </div>
              {layer.avg != null && <p className="tsc-profile-band">{readBand(layer.avg)}</p>}
            </div>
          ))}
        </div>

        <div className="tsc-debrief">
          <h3>For the pilot debrief</h3>
          <p>
            As you went, which statements were unclear, felt off, or did not fit the work you
            actually do? Those are the items to fix. Print this and bring your notes.
          </p>
        </div>
      </section>
    </div>
  )
}

export default TpmSelfCheck
