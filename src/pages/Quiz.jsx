import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { quizQuestions, getCrisisType } from '../data/quizData'
import './Quiz.css'

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [quizComplete, setQuizComplete] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const questionRef = useRef(null)
  const resultRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (quizStarted && questionRef.current) {
      questionRef.current.focus()
    }
  }, [currentQuestion, quizStarted])

  useEffect(() => {
    if (quizComplete && resultRef.current) {
      resultRef.current.focus()
    }
  }, [quizComplete])

  const totalQuestions = quizQuestions.length
  const totalScore = answers.reduce((sum, a) => sum + a.points, 0)
  const crisisType = quizComplete ? getCrisisType(totalScore) : null

  function handleStart() {
    setQuizStarted(true)
  }

  function handleSelectAnswer(answer) {
    setSelectedAnswer(answer)
  }

  function handleNext() {
    if (!selectedAnswer) return

    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setQuizComplete(true)
    }
  }

  function handleRestart() {
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setQuizComplete(false)
    setQuizStarted(false)
  }

  if (!quizStarted) {
    return (
      <div className="quiz-page">
        <section className="quiz-intro" aria-labelledby="quiz-heading">
          <div className="quiz-intro-content">
            <h1 id="quiz-heading">What's On Fire?</h1>
            <p className="quiz-subtitle">A technical health self-assessment</p>
            <p className="quiz-description">
              Six honest questions about the state of your engineering organization.
              No vendor pitch. No sales sequence. Just a clear-eyed look at where you
              stand — and what it means.
            </p>
            <p className="quiz-meta">
              Takes about 2 minutes. Your answers stay on your device.
            </p>
            <button
              className="btn btn-primary btn-large quiz-start-btn"
              onClick={handleStart}
            >
              Start the Assessment
            </button>
          </div>
        </section>
      </div>
    )
  }

  if (quizComplete && crisisType) {
    return (
      <div className="quiz-page">
        <section className="quiz-result" aria-labelledby="result-heading">
          <div className="quiz-result-content">
            <p className="result-label">Your result</p>
            <h1
              id="result-heading"
              className={`result-type result-type--${crisisType.id}`}
              ref={resultRef}
              tabIndex={-1}
            >
              {crisisType.name}
            </h1>
            <p className="result-description">{crisisType.description}</p>
            <p className="result-details">{crisisType.details}</p>

            <div className="result-cta" aria-labelledby="fieldguide-heading">
              <h2 id="fieldguide-heading">We wrote a field guide for this.</h2>
              <p className="whitepaper-title">{crisisType.whitePaper}</p>
              <p className="whitepaper-description">
                Enter your email and we'll unlock the full guide right here — and
                send it to your inbox once you confirm. No spam, unsubscribe anytime.
              </p>
              <FieldGuideForm fireType={crisisType.id} fireName={crisisType.name} />
            </div>

            <div className="result-actions">
              <button className="btn btn-secondary" onClick={handleRestart}>
                Retake the Quiz
              </button>
              <Link to="/contact" className="btn btn-primary">
                Let's Talk
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion) / totalQuestions) * 100

  return (
    <div className="quiz-page">
      <section className="quiz-active" aria-labelledby="question-heading">
        <div className="quiz-active-content">
          {/* Persistent page title for the active view so the heading order starts at h1
              (the question is an h2 that changes per step). */}
          <h1 className="sr-only">What's On Fire? assessment</h1>
          <div
            className="quiz-progress"
            role="progressbar"
            aria-valuenow={currentQuestion + 1}
            aria-valuemin={1}
            aria-valuemax={totalQuestions}
            aria-label={`Question ${currentQuestion + 1} of ${totalQuestions}`}
          >
            <div
              className="quiz-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="quiz-progress-text">
            {currentQuestion + 1} of {totalQuestions}
          </p>

          <h2
            id="question-heading"
            className="quiz-question"
            ref={questionRef}
            tabIndex={-1}
          >
            {question.question}
          </h2>

          <fieldset className="quiz-answers">
            <legend className="sr-only">Select your answer</legend>
            {question.answers.map((answer) => {
              const isSelected = selectedAnswer?.label === answer.label
              return (
                <label
                  key={answer.label}
                  className={`quiz-answer ${isSelected ? 'quiz-answer--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={answer.label}
                    checked={isSelected}
                    onChange={() => handleSelectAnswer(answer)}
                    className="sr-only"
                  />
                  <span className="answer-label" aria-hidden="true">{answer.label}</span>
                  <span className="answer-text">{answer.text}</span>
                </label>
              )
            })}
          </fieldset>

          <button
            className="btn btn-primary btn-large quiz-next-btn"
            onClick={handleNext}
            disabled={!selectedAnswer}
            aria-label={
              currentQuestion + 1 === totalQuestions
                ? 'See your results'
                : 'Next question'
            }
          >
            {currentQuestion + 1 === totalQuestions ? 'See Results' : 'Next'}
          </button>
        </div>
      </section>
    </div>
  )
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function FieldGuideForm({ fireType, fireName }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const [invalidEmail, setInvalidEmail] = useState(false)
  const inputRef = useRef(null)
  const pdfUrl = `/field-guides/${fireType}.pdf`

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'submitting') return

    const trimmed = email.trim()
    if (!EMAIL_RE.test(trimmed)) {
      setStatus('error')
      setInvalidEmail(true)
      setErrorMessage('Please enter a valid email address.')
      inputRef.current?.focus()
      return
    }

    setStatus('submitting')
    setInvalidEmail(false)
    setErrorMessage('')

    try {
      const response = await fetch('/api/field-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, fireType, fireName }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
      inputRef.current?.focus()
    }
  }

  if (status === 'success') {
    return (
      <div className="fieldguide-success" role="status">
        <p className="fieldguide-success-message">
          Your guide is ready. Check your inbox to confirm your subscription —
          we'll email it to you too.
        </p>
        <a className="btn btn-primary" href={pdfUrl} download>
          Download the Guide (PDF)
        </a>
      </div>
    )
  }

  const errorId = 'fieldguide-form-error'

  return (
    <form onSubmit={handleSubmit} className="fieldguide-form" noValidate>
      <div className="form-row">
        <label htmlFor="fieldguide-email" className="sr-only">
          Email address
        </label>
        <input
          ref={inputRef}
          id="fieldguide-email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          aria-invalid={invalidEmail}
          aria-describedby={errorMessage ? errorId : undefined}
          disabled={status === 'submitting'}
          className="form-input"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending…' : 'Get the Guide'}
        </button>
      </div>
      {errorMessage && (
        <p id={errorId} className="form-error" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  )
}

export default Quiz
