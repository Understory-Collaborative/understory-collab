const Q_PREFIX = /^(?:\*\*|__)?Q:(?:\*\*|__)?\s*/
const A_PREFIX = /^(?:\*\*|__)?A:(?:\*\*|__)?\s*/

// A Q&A post is written as a paragraph starting "Q:" and a later one starting "A:".
// Split it so the question and the answer render as their own labeled sections. A
// short last line of the question with no end punctuation is the asker's sign-off.
// Returns null for any post that isn't shaped that way, which then renders as-is.
export function splitQA(content) {
  const blocks = content.split(/\n{2,}/)
  const qi = blocks.findIndex((block) => Q_PREFIX.test(block))
  const ai = blocks.findIndex((block, i) => i > qi && A_PREFIX.test(block))
  if (qi === -1 || ai === -1) return null

  const question = blocks.slice(qi, ai)
  const answer = blocks.slice(ai)
  question[0] = question[0].replace(Q_PREFIX, '')
  answer[0] = answer[0].replace(A_PREFIX, '')

  let signature = ''
  const last = question[question.length - 1].replace(/[*_]/g, '').trim()
  if (question.length > 1 && last.length <= 60 && !/[.?!:,]$/.test(last)) {
    signature = last
    question.pop()
  }

  return {
    intro: blocks.slice(0, qi).join('\n\n'),
    question: question.join('\n\n'),
    signature,
    answer: answer.join('\n\n'),
  }
}
